'use client';

import { useSubmissionStore } from '@/store/useSubmissionStore';
import { useUserStore } from '@/store/useUserStore';
import type { Team, Hackathon } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, Clock, FileText, Globe, Presentation, ArrowRight, 
  Sparkles, UserPlus, UserMinus, ShieldCheck, Mail, Lock, Unlock, 
  Users, Layout, ClipboardList, PenTool, Lightbulb, Link as LinkIcon 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/date';
import { useTeamStore } from '@/store/useTeamStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const CHECKLIST_BY_PHASE: Record<string, string[]> = {
  'planning': [
    '해커톤 주제 분석 및 핵심 아이디어 선정',
    '타겟 사용자 정의 및 페르소나 설정',
    '핵심 기능(MVP) 리스트 확정',
    '시장 조사 및 차별점 분석'
  ],
  'designing': [
    '유저 시나리오 및 와이어프레임 설계',
    '피그마 프로토타입 제작',
    '컬러 팔레트 및 타이포그래피 확정',
    '주요 UI 컴포넌트 라이브러리 검토'
  ],
  'developing': [
    '기본 프로젝트 구조 세팅 (Next.js/Git)',
    'UI 레이아웃 및 핵심 기능 개발',
    '데이터베이스 스키마 및 API 연동',
    '중간 점검 및 버그 수정'
  ],
  'completed': [
    '최종 결과물 배포 (Vercel/Cloud)',
    '시연 영상 촬영 및 편집',
    '기술 문서 및 Readme 작성',
    '최종 제출물 누락 여부 확인'
  ]
};

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
  const { updateTeam } = useTeamStore();
  
  const role = currentUser?.role || '팀원';

  const mySubmission = submissions.find(
    (s) => s.teamCode === team.teamCode && s.hackathonSlug === hackathon.slug
  );

  const handleProgressChange = (status: 'planning' | 'designing' | 'developing' | 'completed', percent: number) => {
    updateTeam(team.teamCode, { progressStatus: status, progressPercent: percent });
  };

  // 현재 데모에서는 제출 폼(SubmitSection)이 하나로 통합되어 있으므로, 
  // 실제 daker 뷰처럼 3가지 카드로 보여주지만 클릭하면 통합 제출로 이동하도록 합니다.
  const isPlanDone = mySubmission?.artifacts?.some(a => a.type === 'text' && a.content && a.content.length > 0);
  const isWebDone = mySubmission?.artifacts?.some(a => a.type === 'url' && a.content && a.content.length > 0);
  const isPptDone = mySubmission?.artifacts?.some(a => a.fileName);

  const cards = [
    {
      id: 'plan',
      title: '기획서 제출',
      icon: FileText,
      desc: '프로젝트의 기획서 및 계획을 작성하세요.',
      deadline: hackathon.period.submissionDeadlineAt,
      isSubmitted: isPlanDone,
    },
    {
      id: 'web',
      title: '최종 웹링크 제출',
      icon: Globe,
      desc: '개발 결과물 및 코드 저장소 링크를 공유하세요.',
      deadline: hackathon.period.submissionDeadlineAt,
      isSubmitted: isWebDone,
    },
    {
      id: 'ppt',
      title: '최종 솔루션 PPT 제출',
      icon: Presentation,
      desc: '발표 자료 및 프리젠테이션을 공유하세요.',
      deadline: hackathon.period.endAt, // 최종발표 전
      isSubmitted: isPptDone,
    },
  ];

  const sortedCards = [...cards].sort((a, b) => {
    const r = role.toLowerCase();
    if (r.includes('개발') || r.includes('엔지니어') || r.includes('프론트') || r.includes('백엔드')) {
      if (a.id === 'web') return -1;
      if (b.id === 'web') return 1;
    } else if (r.includes('기획') || r.includes('planner') || r.includes('pm')) {
      if (a.id === 'plan') return -1;
      if (b.id === 'plan') return 1;
    } else if (r.includes('디자이너') || r.includes('디자인') || r.includes('designer')) {
      if (a.id === 'ppt') return -1;
      if (b.id === 'ppt') return 1;
    }
    return 0;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">작전실</h2>
          <p className="text-sm text-muted-foreground">
            작전실에서 기획서 제출, 최종 웹링크, PPT를 작성한 후 해커톤 최종 제출 페이지에서 제출하세요.
          </p>
        </div>
        <Button 
          onClick={() => router.push(`/hackathons/${hackathon.slug}?tab=submit`)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md w-full sm:w-auto"
        >
          해커톤 최종 제출 페이지 <ArrowRight className="w-4 h-4 ml-1 flex-shrink-0" />
        </Button>
      </div>

      {/* --- Progress Tracker --- */}
      <Card className="p-5 sm:p-6 mb-8 border-indigo-100 dark:border-indigo-900 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-full -z-10" />
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              팀 진행도 실시간 트래커
            </h3>
            <p className="text-xs text-muted-foreground">현재 작업 중인 단계를 클릭하면 팀 카드에 실시간으로 반영됩니다.</p>
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {team.progressPercent || 0}%
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center relative z-10">
          <div className="absolute top-1/2 left-0 w-full h-1.5 -translate-y-1/2 bg-slate-100 dark:bg-slate-800 rounded-full hidden sm:block -z-10" />
          <div 
            className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 bg-indigo-500 rounded-full hidden sm:block -z-10 transition-all duration-500 ease-out" 
            style={{ width: `${team.progressPercent || 0}%` }}
          />
          
          {[
            { id: 'planning', label: '기획', icon: FileText, minPercent: 0, setPercent: 20 },
            { id: 'designing', label: '디자인', icon: Sparkles, minPercent: 25, setPercent: 40 },
            { id: 'developing', label: '개발', icon: Globe, minPercent: 50, setPercent: 80 },
            { id: 'completed', label: '완료/배포', icon: CheckCircle, minPercent: 100, setPercent: 100 },
          ].map((step) => {
            const isActive = team.progressStatus === step.id;
            const isPassed = (team.progressPercent || 0) >= step.minPercent;
            const StepIcon = step.icon;
            
            return (
              <div key={step.id} className="w-full sm:flex-1 relative">
                <Button 
                  variant={isActive ? "default" : isPassed ? "outline" : "secondary"}
                  className={cn(
                    "w-full h-12 rounded-xl transition-all duration-300 font-bold gap-2 border-2",
                    isActive ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 shadow-md scale-[1.02]" : 
                    isPassed ? "border-indigo-400/50 text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800" : 
                    "border-transparent text-slate-400 bg-slate-50 dark:bg-slate-800/50"
                  )}
                  onClick={() => handleProgressChange(step.id as any, step.setPercent)}
                >
                  <StepIcon className={cn("w-4 h-4", isActive ? "text-white" : isPassed ? "text-indigo-500" : "text-slate-400")} />
                  {step.label}
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl p-0.5 shadow-lg group">
        <div className="bg-white dark:bg-slate-900 rounded-[14px] p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <Sparkles className="w-6 h-6 text-indigo-500" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm font-black text-slate-800 dark:text-slate-100 italic">
              "올인원 베이스캠프: 기획부터 제출까지, 이 안에서 끝낸다"
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">{currentUser?.nickname}</strong>님의 역할({role})에 맞춰 가장 우선순위가 높은 과업을 분석했습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 pb-12">
        {/* Left Column: Smart Checklist */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-slate-400">
            <ClipboardList className="w-4 h-4" /> Smart Checklist
          </h3>
          <div className="bg-slate-100/50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 h-full">
            <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">AI Assistant 추천</span>
              </div>
              <h4 className="text-sm font-bold">현재 {team.progressStatus === 'developing' ? '개발' : team.progressStatus === 'designing' ? '디자인' : team.progressStatus === 'completed' ? '완료' : '기획'} 단계 권장 사항</h4>
            </div>
            
            <ul className="space-y-4 pt-2">
              {(CHECKLIST_BY_PHASE[team.progressStatus || 'planning'] || []).map((item, i) => {
                const isChecked = team.checklist?.includes(`${team.progressStatus}-${i}`);
                const toggleItem = () => {
                  const currentList = team.checklist || [];
                  const itemKey = `${team.progressStatus}-${i}`;
                  const newList = isChecked 
                    ? currentList.filter(k => k !== itemKey)
                    : [...currentList, itemKey];
                  updateTeam(team.teamCode, { checklist: newList });
                };

                return (
                  <li 
                    key={i} 
                    onClick={toggleItem}
                    className="flex items-start gap-3 group cursor-pointer"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-md border-2 mt-0.5 flex-shrink-0 flex items-center justify-center transition-all duration-200",
                      isChecked 
                        ? "bg-indigo-500 border-indigo-500 text-white shadow-sm" 
                        : "border-slate-300 dark:border-slate-700 group-hover:border-indigo-400"
                    )}>
                      {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                    <span className={cn(
                      "text-xs font-medium transition-all duration-200",
                      isChecked 
                        ? "text-slate-400 dark:text-slate-500 line-through" 
                        : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                    )}>
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
            
            <div className="mt-8 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
               <p className="text-[10px] text-indigo-600 dark:text-indigo-400 leading-tight">
                 대회 종료까지 <strong>{formatDate(hackathon.period.submissionDeadlineAt)}</strong>가 남았습니다. 화이팅하세요!
               </p>
            </div>
          </div>
        </div>

        {/* Right Column: Work Submission */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-slate-400">
            <Layout className="w-4 h-4" /> Work Submission
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedCards.slice(0, 2).map((card) => {
              const Icon = card.icon;
              const isDone = Boolean(card.isSubmitted);
              
              return (
                <Card key={card.id} className={cn("p-6 flex flex-col h-full border-2 transition-all duration-300", isDone ? "border-emerald-500/30 bg-emerald-50/5" : "border-slate-100 dark:border-slate-800 hover:border-indigo-500/30")}>
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("p-2.5 rounded-xl", isDone ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-100 dark:bg-slate-800 text-slate-400")}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {isDone ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">완료</Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-400 border-slate-200 uppercase text-[10px] tracking-widest">Pending</Badge>
                    )}
                  </div>
                  <h4 className="font-bold text-base mb-1.5">{card.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">{card.desc}</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs font-black text-indigo-600 dark:text-indigo-400 self-start hover:translate-x-1 transition-transform" 
                    onClick={() => router.push(`/hackathons/${hackathon.slug}?tab=submit`)}
                  >
                    데이터 입력하기 &rarr;
                  </Button>
                </Card>
              );
            })}
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Presentation className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h5 className="text-sm font-bold">최종 솔루션 발표 자료</h5>
                <p className="text-[11px] text-muted-foreground">발표용 PPT 또는 노션 링크를 준비해 주세요.</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="text-xs font-bold" onClick={() => router.push(`/hackathons/${hackathon.slug}?tab=submit`)}>
              이동
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
