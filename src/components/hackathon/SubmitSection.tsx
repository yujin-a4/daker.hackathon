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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Upload, AlertTriangle, Target } from 'lucide-react';
import { formatDateTime } from '@/lib/date';
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
  content: z.string().min(1, '내용을 입력하세요.'),
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
  const { addLeaderboardEntry, updateLeaderboardEntryTimestamp } = useHackathonStore();
  const { rankings, recalculateRankings } = useRankingStore();

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
      itemKey: submitInfo.submissionItems?.[0]?.key,
      inputType: 'text',
      content: '',
      fileName: '',
      notes: '',
    },
  });

  const selectedItemKey = form.watch('itemKey');
  const selectedItem = submitInfo.submissionItems?.find(item => item.key === selectedItemKey);
  const format = selectedItem?.format || submitInfo.allowedArtifactTypes[0];

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
    if (!userTeam) {
      toast({ variant: 'destructive', title: '팀에 먼저 참가해야 합니다.' });
      return;
    }

    const now = new Date().toISOString();

    const newArtifact: Submission['artifacts'][0] = {
      type: format,
      key: data.itemKey,
      content: data.content,
      fileName: data.fileName,
      uploadedAt: now,
    };

    if (currentSubmission) {
      // ── 기존 제출 업데이트 ──
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
      // ── 새 제출 ──
      // 1. 먼저 리더보드에 엔트리 추가
      addLeaderboardEntry(hackathonSlug, {
        teamName: userTeam.name,
        score: null,
        rank: null,
        submittedAt: now,
      });

      // 2. submission 저장
      addSubmission({
        hackathonSlug,
        teamCode: userTeam.teamCode,
        teamName: userTeam.name,
        status: 'submitted',
        artifacts: [newArtifact],
        notes: data.notes || '',
        submittedAt: now,
      });

      // 3. 이 해커톤에 처음 제출 → 랭킹 참가 횟수 +1
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
      recalculateRankings();
    }

    toast({ title: '제출이 완료되었습니다.' });
    form.reset();
    setSelectedFile(null);
  };

  const handleCancelArtifact = (key: string) => {
    if (!currentSubmission || !userTeam) return;

    const updatedArtifacts = currentSubmission.artifacts.filter(a => a.key !== key);
    updateSubmission(currentSubmission.id, { artifacts: updatedArtifacts });

    // 모든 artifact가 제거되면 리더보드에서도 제출 시간 null 처리
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

      {submitInfo.submissionItems && (
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
      )}

      <div>
        <h3 className="text-lg font-bold mb-4">새 제출</h3>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 bg-card border rounded-lg">
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

            {form.formState.errors.content && <p className="text-sm text-red-500 mt-1">{form.formState.errors.content.message}</p>}
          </div>

          <Textarea rows={3} placeholder="메모 (선택사항)" {...form.register('notes')} />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => { form.reset(); setSelectedFile(null); }}>취소</Button>
            <Button type="submit">제출하기</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
