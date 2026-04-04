'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertTriangle, CheckCircle, Clock, Send, Target, Upload, XCircle } from 'lucide-react';

import type { HackathonDetail, Submission } from '@/types';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useRankingStore } from '@/store/useRankingStore';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/hooks/use-toast';
import { getHackathonPhase } from '@/lib/hackathon-utils';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/date';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type SubmitSectionProps = {
  hackathonSlug: string;
  hackathonDetail: HackathonDetail;
};

const FormSchema = z.object({
  itemKey: z.string().optional(),
  content: z.string().min(1, '결과물을 입력해 주세요.'),
  fileName: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

export default function SubmitSection({ hackathonSlug, hackathonDetail }: SubmitSectionProps) {
  const router = useRouter();
  const { toast } = useToast();

  const { currentUser, addPointHistory } = useUserStore();
  const { teams } = useTeamStore();
  const { submissions, addSubmission, updateSubmission } = useSubmissionStore();
  const { hackathons, addLeaderboardEntry, updateAutoScore, updateLeaderboardEntryTimestamp } = useHackathonStore();
  const { recalculateRankings } = useRankingStore();

  const hackathon = useMemo(
    () => hackathons.find((item) => item.slug === hackathonSlug),
    [hackathons, hackathonSlug]
  );
  const currentPhase = useMemo(() => getHackathonPhase(hackathonDetail), [hackathonDetail]);
  const isEnded = hackathon?.status === 'ended' || currentPhase.type === 'RESULT';
  const isPreparation = currentPhase.type === 'PREPARATION';
  const isSubmissionPhase = currentPhase.type === 'SUBMISSION';
  const activeItemKey = currentPhase.itemKey;

  const userTeam = useMemo(() => {
    if (!currentUser) return null;
    return teams.find((team) => team.hackathonSlug === hackathonSlug && currentUser.teamCodes.includes(team.teamCode));
  }, [currentUser, teams, hackathonSlug]);

  const currentSubmission = useMemo(() => {
    if (!userTeam) return null;
    return submissions.find((submission) => submission.hackathonSlug === hackathonSlug && submission.teamCode === userTeam.teamCode);
  }, [hackathonSlug, submissions, userTeam]);

  const submitInfo = hackathonDetail.sections.submit;
  const activeSubmissionItems = useMemo(() => {
    const items = submitInfo.submissionItems || [];
    if (!isSubmissionPhase || !activeItemKey) return items;
    return items.filter((item) => item.key === activeItemKey);
  }, [submitInfo.submissionItems, isSubmissionPhase, activeItemKey]);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      itemKey: activeItemKey || submitInfo.submissionItems?.[0]?.key,
      content: '',
      fileName: '',
      notes: '',
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isSubmissionPhase && activeItemKey) {
      form.setValue('itemKey', activeItemKey);
    }
  }, [activeItemKey, form, isSubmissionPhase]);

  const selectedItemKey = form.watch('itemKey');
  const selectedItem = (submitInfo.submissionItems || []).find((item) => item.key === selectedItemKey);
  const format = (selectedItem?.format || submitInfo.allowedArtifactTypes[0] || 'text').toLowerCase();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    const file = event.target.files[0];
    setSelectedFile(file);
    form.setValue('fileName', file.name);
    form.setValue('content', file.name);
    form.clearErrors('content');
  };

  const onSubmit = (data: FormData) => {
    if (!userTeam || !data.itemKey) return;

    const uploadedAt = new Date().toISOString();
    const artifact: Submission['artifacts'][0] = {
      type: format,
      key: data.itemKey,
      content: data.content,
      fileName: data.fileName,
      uploadedAt,
    };

    if (currentSubmission) {
      updateSubmission(currentSubmission.id, {
        artifacts: [
          ...currentSubmission.artifacts.filter((item) => item.key !== data.itemKey),
          artifact,
        ],
        notes: data.notes || currentSubmission.notes,
        submittedAt: uploadedAt,
      });
      updateLeaderboardEntryTimestamp(hackathonSlug, userTeam.name, uploadedAt);
    } else {
      addLeaderboardEntry(hackathonSlug, {
        rank: null,
        teamName: userTeam.name,
        score: null,
        submittedAt: uploadedAt,
      });
      addSubmission({
        hackathonSlug,
        teamCode: userTeam.teamCode,
        teamName: userTeam.name,
        status: 'submitted',
        artifacts: [artifact],
        notes: data.notes || '',
        submittedAt: uploadedAt,
      });
    }

    updateAutoScore(hackathonSlug, userTeam.name, Math.floor(Math.random() * 16) + 85);
    addPointHistory(`'${hackathonDetail.title}' 결과물 제출 완료`, 50);
    recalculateRankings();

    toast({
      title: '결과물을 제출했습니다.',
      description: '제출 현황과 랭킹 계산에 바로 반영됩니다.',
    });

    form.reset({
      itemKey: activeItemKey || submitInfo.submissionItems?.[0]?.key,
      content: '',
      fileName: '',
      notes: '',
    });
    setSelectedFile(null);
  };

  const handleCancelArtifact = (key: string) => {
    if (!currentSubmission || !userTeam) return;

    const artifacts = currentSubmission.artifacts.filter((artifact) => artifact.key !== key);
    updateSubmission(currentSubmission.id, {
      artifacts,
      submittedAt: artifacts.length > 0 ? artifacts[artifacts.length - 1].uploadedAt : null,
    });

    if (artifacts.length === 0) {
      updateLeaderboardEntryTimestamp(hackathonSlug, userTeam.name, null);
    } else {
      updateLeaderboardEntryTimestamp(hackathonSlug, userTeam.name, artifacts[artifacts.length - 1].uploadedAt);
    }

    recalculateRankings();
    toast({ title: '제출을 취소했습니다.' });
  };

  if (isPreparation) {
    return (
      <div className="p-10 border-2 border-dashed rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 text-center flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-500">
          <Clock className="w-7 h-7" />
        </div>
        <div>
          <p className="font-bold text-lg text-slate-700 dark:text-slate-200">아직 대회가 시작되지 않았습니다.</p>
          <p className="text-sm text-slate-400 mt-2">
            {currentPhase.endDate
              ? `${currentPhase.endDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}에 시작됩니다.`
              : '시작 일정을 확인해 주세요.'}
          </p>
        </div>
      </div>
    );
  }

  if (!userTeam) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>참여 중인 팀이 없습니다</AlertTitle>
        <AlertDescription>
          제출하려면 먼저 팀에 참여하거나 팀을 만들어야 합니다.
          <Button variant="link" className="p-0 h-auto ml-2" onClick={() => router.push(`/camp?hackathon=${hackathonSlug}`)}>
            팀 찾기
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-indigo-600 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-white shadow-lg gap-4 mt-2">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-300" />
            팀 베이스캠프로 이동
          </h3>
          <p className="text-indigo-100 text-sm mt-1">
            제출 전후로 베이스캠프에서 전략과 메모를 함께 관리할 수 있습니다.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => router.push(`/basecamp/${userTeam.teamCode}`)}
          className="flex-shrink-0 w-full sm:w-auto font-bold bg-white text-indigo-700 hover:bg-slate-100 shadow-md"
        >
          이동
        </Button>
      </div>

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

      {submitInfo.submissionItems && submitInfo.submissionItems.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4">제출 현황</h3>
          <div className="bg-card border rounded-lg divide-y">
            {submitInfo.submissionItems.map((item) => {
              const submittedArtifact = currentSubmission?.artifacts.find((artifact) => artifact.key === item.key);
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
                        <Button variant="link" size="sm" className="text-red-500 hover:text-red-600">
                          취소
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>제출을 취소하시겠습니까?</AlertDialogTitle>
                          <AlertDialogDescription>해당 단계 제출 내역이 리더보드와 함께 갱신됩니다.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>닫기</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleCancelArtifact(item.key)} className="bg-red-600 hover:bg-red-700">
                            제출 취소
                          </AlertDialogAction>
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

      {!isEnded && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">새 제출</h3>
            <Badge variant={isSubmissionPhase ? 'default' : 'secondary'} className={cn(isSubmissionPhase ? 'bg-emerald-500 text-white' : '')}>
              {currentPhase.name} {isSubmissionPhase ? '진행 중' : '대기 중'}
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
                    ? `${formatDateTime(currentPhase.endDate.toISOString())}에 다음 단계로 전환됩니다.`
                    : '일정을 확인해 주세요.'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 bg-card border rounded-lg shadow-sm">
              {activeSubmissionItems.length > 0 && (
                <Controller
                  control={form.control}
                  name="itemKey"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="제출할 항목을 선택해 주세요." />
                      </SelectTrigger>
                      <SelectContent>
                        {activeSubmissionItems.map((item) => (
                          <SelectItem key={item.key} value={item.key}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}

              <div>
                {(format === 'zip' || format === 'pdf' || format === 'pdf_url') && (
                  <div className="border-dashed border-2 border-muted-foreground/30 rounded-xl p-8 text-center">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept={format.includes('pdf') ? '.pdf' : '.zip'}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {selectedFile ? selectedFile.name : '파일을 선택해 주세요.'}
                      </p>
                    </label>
                  </div>
                )}

                {format === 'url' && (
                  <Input type="url" placeholder="https://example.com" {...form.register('content')} />
                )}

                {format !== 'url' && format !== 'zip' && format !== 'pdf' && format !== 'pdf_url' && (
                  <Input type="text" placeholder="결과물 경로 또는 설명" {...form.register('content')} />
                )}

                {form.formState.errors.content && (
                  <p className="text-sm text-red-500 mt-1 font-bold">{form.formState.errors.content.message}</p>
                )}
              </div>

              <Textarea rows={3} placeholder="메모 (선택)" {...form.register('notes')} />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    form.reset({
                      itemKey: activeItemKey || submitInfo.submissionItems?.[0]?.key,
                      content: '',
                      fileName: '',
                      notes: '',
                    });
                    setSelectedFile(null);
                  }}
                >
                  취소
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                  <Send className="w-4 h-4 mr-2" />
                  결과물 제출
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
