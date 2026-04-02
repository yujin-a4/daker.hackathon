'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import type { HackathonDetail, Submission } from '@/types';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { useUserStore } from '@/store/useUserStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useRankingStore } from '@/store/useRankingStore';
import { useToast } from '@/hooks/use-toast';
import { useTeamStore } from '@/store/useTeamStore';
import { getHackathonPhase } from '@/lib/hackathon-utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Upload, AlertTriangle, Target, Clock, Send } from 'lucide-react';
import { formatDateTime } from '@/lib/date';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SubmitSectionProps = {
  hackathonSlug: string;
  hackathonDetail: HackathonDetail;
};

const FormSchema = z.object({
  itemKey: z.string().optional(),
  inputType: z.enum(['text', 'url']).optional(),
  content: z.string().min(1, '결과물 링크나 내용을 입력해주세요.'),
  fileName: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

export default function SubmitSection({ hackathonSlug, hackathonDetail }: SubmitSectionProps) {
  const router = useRouter();
  const { toast } = useToast();

  const { currentUser } = useUserStore();
  const { teams } = useTeamStore();
  const { submissions, addSubmission, updateSubmission } = useSubmissionStore();
  const { hackathons, addLeaderboardEntry, updateLeaderboardEntryTimestamp, updateAutoScore } = useHackathonStore();
  const { rankings, recalculateRankings } = useRankingStore();

  const hackathon = useMemo(() => hackathons.find(h => h.slug === hackathonSlug), [hackathons, hackathonSlug]);
  const isEnded = hackathon?.status === 'ended';

  const currentPhase = useMemo(() => getHackathonPhase(hackathonDetail), [hackathonDetail]);
  const isSubmissionPhase = currentPhase.type === 'SUBMISSION';
  const activeItemKey = currentPhase.itemKey;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const userTeam = useMemo(() => {
    if (!currentUser) return null;
    return teams.find(t => t.hackathonSlug === hackathonSlug && currentUser.teamCodes.includes(t.teamCode));
  }, [currentUser, teams, hackathonSlug]);

  const currentSubmission = useMemo(() => {
    if (!userTeam) return null;
    return submissions.find(s => s.hackathonSlug === hackathonSlug && s.teamCode === userTeam.teamCode);
  }, [userTeam, submissions, hackathonSlug]);

  const { sections: { submit: submitInfo } } = hackathonDetail;

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      itemKey: activeItemKey || submitInfo.submissionItems?.[0]?.key,
      inputType: 'text',
      content: '',
      fileName: '',
      notes: '',
    },
  });

  React.useEffect(() => {
    if (activeItemKey) {
      form.setValue('itemKey', activeItemKey);
    }
  }, [activeItemKey, form]);

  const selectedItemKey = form.watch('itemKey');
  const selectedItem = submitInfo.submissionItems?.find(item => item.key === selectedItemKey);
  const format = (selectedItem?.format || submitInfo.allowedArtifactTypes[0] || 'text').toLowerCase();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      form.setValue('fileName', file.name);
      form.setValue('content', file.name);
      form.clearErrors('content');
    }
  };

  const onSubmit = (data: FormData) => {
    if (!userTeam) return;

    const now = new Date().toISOString();
    const newArtifact: Submission['artifacts'][0] = {
      type: format,
      key: data.itemKey,
      content: data.content,
      fileName: data.fileName,
      uploadedAt: now,
    };

    if (currentSubmission) {
      const updatedArtifacts = [
        ...currentSubmission.artifacts.filter(a => a.key !== newArtifact.key),
        newArtifact,
      ];
      updateSubmission(currentSubmission.id, {
        artifacts: updatedArtifacts,
        notes: data.notes,
        submittedAt: now,
      });
      updateLeaderboardEntryTimestamp(hackathonSlug, userTeam.name, now);
    } else {
      addLeaderboardEntry(hackathonSlug, {
        teamName: userTeam.name,
        score: null,
        rank: null,
        submittedAt: now,
      });

      addSubmission({
        hackathonSlug,
        teamCode: userTeam.teamCode,
        teamName: userTeam.name,
        status: 'submitted',
        artifacts: [newArtifact],
        notes: data.notes || '',
        submittedAt: now,
      });

      if (currentUser) {
        const alreadySubmitted = submissions.some(
          s => s.hackathonSlug === hackathonSlug && s.teamCode === userTeam.teamCode
        );
        if (!alreadySubmitted) {
          const updatedRankings = rankings.map(r =>
            r.nickname === currentUser.nickname
              ? { ...r, hackathonsJoined: r.hackathonsJoined + 1, lastActiveAt: now }
              : r
          );
          useRankingStore.setState({ rankings: updatedRankings });
        }
      }
    }

    // 🌟 [수정됨] 나중(결과 발표)을 위해 백그라운드에 점수만 조용히 저장해둠. (UI에는 안 뜸)
    const secretAiScore = Math.floor(Math.random() * 16) + 85;
    updateAutoScore(hackathonSlug, userTeam.name, secretAiScore);

    // 🌟 제출 완료 깔끔한 알림
    toast({
      title: '✅ 결과물 제출 완료!',
      description: `성공적으로 제출되었습니다. 리더보드에 진행 상황이 즉시 반영됩니다.`,
      className: 'bg-emerald-600 text-white border-none',
    });

    form.reset();
    setSelectedFile(null);
  };

  const handleCancelArtifact = (key: string) => {
    if (!currentSubmission || !userTeam) return;

    const updatedArtifacts = currentSubmission.artifacts.filter(a => a.key !== key);
    updateSubmission(currentSubmission.id, { artifacts: updatedArtifacts });

    if (updatedArtifacts.length === 0) {
      updateLeaderboardEntryTimestamp(hackathonSlug, userTeam.name, null);
    }
    toast({ title: '제출이 취소되었습니다.' });
  };

  if (!userTeam) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>팀 소속이 아닙니다</AlertTitle>
        <AlertDescription>
          이 해커톤에 제출하려면 먼저 팀에 참가하거나 생성해야 합니다.
          <Button variant="link" className="p-0 h-auto ml-2" onClick={() => router.push(`/camp?hackathon=${hackathonSlug}`)}>
            팀 찾아보기
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {userTeam && (
        <div className="bg-indigo-600 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-white shadow-lg gap-4 mt-2">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-300" />
              팀 작전실(Basecamp) 오픈!
            </h3>
            <p className="text-indigo-100 text-sm mt-1">
              제출 전, 팀 작전실에 입장하여 일정을 점검하고 패들렛 보드에서 팀원들과 아이디어를 나누세요.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push(`/basecamp/${userTeam.teamCode}`)}
            className="flex-shrink-0 w-full sm:w-auto font-bold bg-white text-indigo-700 hover:bg-slate-100 shadow-md"
          >
            입장하기
          </Button>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl p-6">
        <ul className="space-y-4">
          {submitInfo.guide.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-blue-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">
                {index + 1}
              </div>
              <span className="text-blue-900 dark:text-blue-200 mt-0.5">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {submitInfo.submissionItems && submitInfo.submissionItems.length > 0 ? (
        <div>
          <h3 className="text-lg font-bold mb-4">제출 현황</h3>
          <div className="bg-card border rounded-lg divide-y">
            {submitInfo.submissionItems.map(item => {
              const submittedArtifact = currentSubmission?.artifacts.find(a => a.key === item.key);
              return (
                <div key={item.key} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    {submittedArtifact ? (
                      <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5 mt-1">
                        <CheckCircle className="w-4 h-4" />
                        제출 완료 ({formatDateTime(submittedArtifact.uploadedAt)})
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                        <XCircle className="w-4 h-4" />
                        미제출
                      </p>
                    )}
                  </div>
                  {submittedArtifact && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="link" size="sm" className="text-red-500 hover:text-red-600">취소</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>제출을 취소하시겠습니까?</AlertDialogTitle>
                          <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>닫기</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleCancelArtifact(item.key)} className="bg-red-600 hover:bg-red-700">제출 취소</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : currentSubmission && currentSubmission.artifacts.length > 0 ? (
        <div>
          <h3 className="text-lg font-bold mb-4">제출 현황</h3>
          <div className="bg-card border rounded-lg divide-y">
            {currentSubmission.artifacts.map((a, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{a.fileName || a.content || `제출 항목 #${idx + 1}`}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5 mt-1">
                    <CheckCircle className="w-4 h-4" />
                    제출 완료 ({formatDateTime(a.uploadedAt)})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {!isEnded && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">새 제출</h3>
            <Badge variant={isSubmissionPhase ? "default" : "secondary"} className={cn(isSubmissionPhase ? "bg-emerald-500 text-white" : "")}>
              {currentPhase.name} {isSubmissionPhase ? "진행 중" : "준비/심사 중"}
            </Badge>
          </div>

          {!isSubmissionPhase ? (
            <div className="p-8 border-2 border-dashed rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-600">현재는 제출 기간이 아닙니다.</p>
                <p className="text-sm text-slate-400 mt-1">
                  {currentPhase.endDate
                    ? `${formatDateTime(currentPhase.endDate.toISOString())}에 다음 단계가 시작됩니다.`
                    : "대회 일정을 확인해 주세요."}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 bg-card border rounded-lg shadow-sm">
              {submitInfo.submissionItems && (
                <Controller
                  control={form.control}
                  name="itemKey"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="제출할 항목을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {submitInfo.submissionItems?.map(item => (
                          <SelectItem key={item.key} value={item.key}>{item.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}

              <div>
                {(format === 'zip' || format === 'pdf' || format === 'pdf_url') && (
                  <div className="border-dashed border-2 border-muted-foreground/30 rounded-xl p-8 text-center">
                    <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept={format.includes('pdf') ? '.pdf' : '.zip'} />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">{selectedFile ? selectedFile.name : '파일을 드래그하거나 클릭하여 업로드'}</p>
                    </label>
                  </div>
                )}

                {format === 'text_or_url' && (
                  <div className="flex flex-col gap-2">
                    <Input type="text" placeholder="https://... 또는 텍스트 입력" {...form.register('content')} />
                  </div>
                )}

                {format === 'url' && (
                  <Input type="url" placeholder="https://example.com" {...form.register('content')} />
                )}

                {form.formState.errors.content && <p className="text-sm text-red-500 mt-1 font-bold">{form.formState.errors.content.message}</p>}
              </div>

              <Textarea rows={3} placeholder="메모 (선택사항)" {...form.register('notes')} />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => { form.reset(); setSelectedFile(null); }}>취소</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                  <Send className="w-4 h-4 mr-2" />
                  결과물 최종 제출
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}