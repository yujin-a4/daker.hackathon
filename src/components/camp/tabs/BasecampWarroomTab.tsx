'use client';

import { useEffect, useState } from 'react';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { useUserStore } from '@/store/useUserStore';
import type { Team, Hackathon } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Clock,
  FileText,
  Globe,
  Presentation,
  ArrowRight,
  Activity,
  Plus,
  Trash2,
  ExternalLink,
  StickyNote,
  TrendingUp,
  Layout,
  Lightbulb,
  PenTool,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeamStore } from '@/store/useTeamStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type ProgressStep = 'planning' | 'designing' | 'developing' | 'completed';

export default function BasecampWarroomTab({
  team,
  hackathon,
}: {
  team: Team;
  hackathon: Hackathon;
}) {
  const router = useRouter();
  const { submissions } = useSubmissionStore();
  const { currentUser } = useUserStore();
  const { updateTeam, addTeamMemo, removeTeamMemo } = useTeamStore();

  const [newMemo, setNewMemo] = useState({ title: '', content: '' });
  const [showMemoForm, setShowMemoForm] = useState(false);
  const [teamContextDraft, setTeamContextDraft] = useState({
    availabilitySummary: team.availabilitySummary || '',
    projectStatusDetail: team.projectStatusDetail || '',
  });

  useEffect(() => {
    setTeamContextDraft({
      availabilitySummary: team.availabilitySummary || '',
      projectStatusDetail: team.projectStatusDetail || '',
    });
  }, [team.availabilitySummary, team.projectStatusDetail, team.teamCode]);

  const role = currentUser?.role || '팀원';
  const isLeader = currentUser?.id === team.leaderId;

  const handleProgressChange = (status: ProgressStep, percent: number) => {
    updateTeam(team.teamCode, { progressStatus: status, progressPercent: percent });
  };

  const handleSaveTeamContext = () => {
    updateTeam(team.teamCode, {
      availabilitySummary: teamContextDraft.availabilitySummary.trim(),
      projectStatusDetail: teamContextDraft.projectStatusDetail.trim(),
    });
  };

  const mySubmission = submissions.find((submission) => submission.teamCode === team.teamCode && submission.hackathonSlug === hackathon.slug);

  const isPlanDone = mySubmission?.artifacts?.some((artifact) => artifact.type === 'text' && artifact.content && artifact.content.length > 0);
  const isWebDone = mySubmission?.artifacts?.some((artifact) => artifact.type === 'url' && artifact.content && artifact.content.length > 0);
  const isPptDone = mySubmission?.artifacts?.some((artifact) => artifact.fileName);

  const submissionCards = [
    { id: 'plan', title: '기획안', icon: FileText, isSubmitted: isPlanDone },
    { id: 'web', title: '웹 링크', icon: Globe, isSubmitted: isWebDone },
    { id: 'ppt', title: '발표 자료', icon: Presentation, isSubmitted: isPptDone },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 pb-20 duration-500">
      <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl md:flex-row md:items-end">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <Badge className="bg-indigo-500 py-0.5 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600">Control Center</Badge>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <Activity className="h-3 w-3 animate-pulse" /> LIVE
            </div>
          </div>
          <h2 className="mb-2 text-3xl font-black tracking-tight">작전실: {team.name}</h2>
          <p className="max-w-md text-sm font-medium leading-relaxed text-slate-400">
            {hackathon.title} 팀의 성공적인 제출을 위해 작업 진척도와 공용 정보를 한 화면에서 관리합니다.
          </p>
        </div>

        <div className="relative z-10 flex min-w-[240px] flex-col gap-3">
          <div className="mb-1 flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
            <span>전체 공정률</span>
            <span className="text-indigo-400">{team.progressPercent || 0}%</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full border border-slate-700 bg-slate-800 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${team.progressPercent || 0}%` }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
            />
          </div>
          <Button
            onClick={() => router.push(`/hackathons/${hackathon.slug}?tab=submit`)}
            className="mt-2 h-11 rounded-xl bg-white font-black text-slate-900 shadow-lg shadow-white/5 hover:bg-slate-100"
          >
            최종 결과물 제출하기 <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="rounded-[2rem] border-2 border-slate-100 p-8 shadow-sm dark:border-slate-800">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/10 p-2.5">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold">진행 상황 추적기</h3>
            <p className="text-xs font-medium text-muted-foreground">현재 단계에 맞춰 팀 전체 진행 상태를 업데이트하세요.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { id: 'planning', label: '기획 단계', p: 20, desc: '아이디어 정의와 역할 정리' },
            { id: 'designing', label: '설계 단계', p: 40, desc: '구조 설계와 화면 정리' },
            { id: 'developing', label: '개발 단계', p: 80, desc: '구현과 통합 진행' },
            { id: 'completed', label: '마무리 단계', p: 100, desc: '제출 및 최종 검수' },
          ].map((step) => (
            <Button
              key={step.id}
              variant={team.progressStatus === step.id ? 'default' : 'outline'}
              onClick={() => handleProgressChange(step.id as ProgressStep, step.p)}
              className={cn(
                'relative h-24 overflow-hidden rounded-2xl border-2 transition-all duration-300',
                'flex flex-col items-center justify-center gap-2',
                team.progressStatus === step.id
                  ? 'scale-[1.03] border-indigo-600 bg-indigo-600 text-white shadow-2xl shadow-indigo-200'
                  : 'bg-white hover:border-indigo-200 dark:bg-slate-900'
              )}
            >
              <span className="relative z-10 text-sm font-black">{step.label}</span>
              <span className="relative z-10 text-[10px] font-bold opacity-70">{step.desc}</span>
              {team.progressStatus === step.id && (
                <motion.div layoutId="activeStep" className="absolute inset-0 -z-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
              )}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="rounded-[2rem] border-2 border-slate-100 p-8 shadow-sm dark:border-slate-800">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">팀 컨텍스트</h3>
            <p className="text-xs font-medium text-muted-foreground">
              여기서 수정한 작업 가능 시간과 상세 진행 상태/비전은 팀 모집 화면과 Basecamp 정보 탭에 함께 반영됩니다.
            </p>
          </div>
          {isLeader && (
            <Button className="rounded-xl" onClick={handleSaveTeamContext}>
              정보 업데이트
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">작업 가능 시간</p>
            <Input
              value={teamContextDraft.availabilitySummary}
              onChange={(event) => setTeamContextDraft((prev) => ({ ...prev, availabilitySummary: event.target.value }))}
              placeholder="평일 20:00~24:00, 주말 오후 가능"
              disabled={!isLeader}
              maxLength={120}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">상세 진행 상태 / 비전</p>
            <Textarea
              value={teamContextDraft.projectStatusDetail}
              onChange={(event) => setTeamContextDraft((prev) => ({ ...prev, projectStatusDetail: event.target.value }))}
              placeholder="현재 어디까지 끝났고, 다음 단계에서 무엇을 만들지, 새 팀원이 어디에 들어오면 좋은지 적어주세요."
              disabled={!isLeader}
              maxLength={600}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card className="flex h-full flex-col rounded-[2rem] border-2 border-slate-100 bg-amber-50/5 p-8 shadow-sm dark:border-slate-800">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-500/10 p-2.5">
                  <StickyNote className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">팀 공유 메모</h3>
                  <p className="text-xs font-medium text-muted-foreground">실시간으로 기획 메모, 링크, 회의 결과를 남겨두세요.</p>
                </div>
              </div>
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50"
                onClick={() => setShowMemoForm(!showMemoForm)}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            <div className="scrollbar-hide max-h-[400px] flex-1 space-y-4 overflow-y-auto pr-1">
              <AnimatePresence>
                {showMemoForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-6 space-y-3 rounded-2xl border-2 border-dashed border-amber-200 bg-white p-5 shadow-xl dark:border-amber-900/30 dark:bg-slate-900"
                  >
                    <Input
                      placeholder="제목 (예: Figma 링크)"
                      className="h-10 rounded-xl border-slate-200 text-xs"
                      value={newMemo.title}
                      onChange={(event) => setNewMemo({ ...newMemo, title: event.target.value })}
                    />
                    <Textarea
                      placeholder="내용 또는 URL을 입력하세요."
                      className="min-h-[100px] resize-none rounded-xl border-slate-200 text-xs"
                      value={newMemo.content}
                      onChange={(event) => setNewMemo({ ...newMemo, content: event.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button
                        className="h-10 flex-1 rounded-xl bg-amber-600 text-xs font-black hover:bg-amber-700"
                        onClick={() => {
                          if (newMemo.title || newMemo.content) {
                            addTeamMemo(team.teamCode, newMemo);
                            setNewMemo({ title: '', content: '' });
                            setShowMemoForm(false);
                          }
                        }}
                      >
                        메모 추가
                      </Button>
                      <Button variant="ghost" className="h-10 rounded-xl text-xs font-bold" onClick={() => setShowMemoForm(false)}>
                        취소
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {(team.teamMemos || []).length === 0 && !showMemoForm && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                  <PenTool className="mb-4 h-14 w-14 opacity-20" />
                  <p className="text-sm font-bold">공유된 메모가 없습니다.</p>
                  <p className="text-xs opacity-60">기획 아이디어와 레퍼런스를 기록해두세요.</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {(team.teamMemos || []).map((memo) => (
                  <motion.div
                    layout
                    key={memo.id}
                    className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-amber-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <button
                      onClick={() => removeTeamMemo(team.teamCode, memo.id)}
                      className="absolute right-3 top-3 p-1.5 text-slate-300 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <h4 className="mb-2 flex items-center gap-2 pr-6 text-sm font-black text-slate-900 dark:text-slate-100">
                      {memo.title}
                      {memo.content.startsWith('http') && <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />}
                    </h4>
                    <p className="line-clamp-3 break-all text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{memo.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <Card className="flex-1 rounded-[2rem] border-2 border-slate-100 p-8 shadow-sm dark:border-slate-800">
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/10 p-2.5">
                <Layout className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold">제출 허브</h3>
            </div>

            <div className="flex flex-col gap-4">
              {submissionCards.map((card) => {
                const Icon = card.icon;
                const isDone = card.isSubmitted;

                return (
                  <div
                    key={card.id}
                    onClick={() => router.push(`/hackathons/${hackathon.slug}?tab=submit`)}
                    className={cn(
                      'flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 transition-all duration-300 hover:shadow-lg',
                      isDone ? 'border-emerald-500/20 bg-emerald-50/30' : 'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900'
                    )}
                  >
                    <div className={cn('rounded-xl p-3', isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800')}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black">{card.title}</p>
                      <p className={cn('text-[10px] font-black uppercase', isDone ? 'text-emerald-600' : 'text-slate-400')}>
                        {isDone ? 'COMPLETED' : 'PENDING'}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl">
            <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:rotate-12">
              <Clock className="h-20 w-20" />
            </div>
            <div className="mb-6">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Release Countdown</p>
              <p className="text-4xl font-black tracking-tighter">
                D-{Math.ceil((new Date(hackathon.period.submissionDeadlineAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-6">
              <p className="text-xs font-bold text-slate-400">예상 획득 포인트</p>
              <p className="text-xl font-black text-indigo-400">+50 XP</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 rounded-[2rem] border-2 border-indigo-100/50 bg-indigo-50/50 p-6 dark:border-indigo-900/30 dark:bg-indigo-900/10 md:flex-row">
        <div className="rounded-2xl bg-indigo-600 p-4 text-white shadow-lg">
          <Lightbulb className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <h4 className="mb-1 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{role} 작업 팁</h4>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {role.includes('개발')
              ? 'GitHub 작업 컨벤션을 먼저 맞추고 코드 리뷰 기준을 짧게 합의해두면 진행 속도가 확실히 올라갑니다.'
              : role.includes('디자인')
                ? '핵심 사용자 여정과 화면 우선순위를 먼저 정리하면 후반 수정 비용을 크게 줄일 수 있습니다.'
                : '지금 단계에서 가장 중요한 것은 멋진 문구보다 명확한 역할 분담과 제출물 기준을 맞추는 일입니다.'}
          </p>
        </div>
      </div>
    </div>
  );
}
