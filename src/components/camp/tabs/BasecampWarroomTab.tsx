'use client';

import { useSubmissionStore } from '@/store/useSubmissionStore';
import { useUserStore } from '@/store/useUserStore';
import type { Team, Hackathon } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, FileText, Globe, Presentation, ArrowRight, Sparkles, UserPlus, UserMinus, ShieldCheck, Mail, Lock, Unlock, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/date';
import { useTeamStore } from '@/store/useTeamStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-4 border flex gap-3 items-center mt-6">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
          <strong className="font-bold">{currentUser?.nickname}</strong>님의 역할({role})에 맞춰 가장 우선순위가 높은 작업업무를 상단에 배치했습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-6">
        {sortedCards.map((card, index) => {
          const Icon = card.icon;
          const isDone = Boolean(card.isSubmitted);
          const isPriority = index === 0;
          
          return (
            <Card key={card.id} className={`p-5 lg:p-6 flex flex-col h-full border ${isDone ? 'border-blue-500/50 bg-blue-50/10' : (isPriority ? 'border-blue-400 dark:border-blue-700 shadow-md ring-1 ring-blue-400/20' : 'border-border')}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${isDone ? 'bg-blue-100 text-blue-600' : (isPriority ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'bg-muted text-muted-foreground')}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  {isPriority && !isDone && (
                     <span className="text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded-full">
                       추천 우선작업
                     </span>
                  )}
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    {isDone ? (
                      <span className="text-emerald-600 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> 제출 완료
                      </span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> 미작성
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground flex-1 mb-8">
                {card.desc}
              </p>
              
              <div className="mt-auto pt-4 border-t flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-rose-500 font-semibold flex items-center gap-1">
                     <Clock className="w-3.5 h-3.5" /> 마감일
                  </span>
                  <span className="text-muted-foreground">
                    ~{formatDate(card.deadline)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground italic">
                    {isDone ? '제출이 완료되었습니다.' : '아직 작성된 내용이 없습니다.'}
                  </span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-semibold text-blue-600"
                    onClick={() => router.push(`/hackathons/${hackathon.slug}?tab=submit`)}
                  >
                    작성하기 &rarr;
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* --- Team Leader Management Console --- */}
      {team.leaderId === currentUser?.id && (
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="mt-12 p-6 lg:p-8 rounded-3xl border-2 border-slate-900 bg-slate-900 text-white shadow-2xl relative overflow-hidden"
        >
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl -z-0 rounded-full -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-xl font-black italic tracking-tight">팀장 전용 관리 콘솔</h3>
                </div>
                <p className="text-sm text-slate-400">팀원 초대 및 모집 상태를 직접 관리할 수 있는 공간입니다.</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={team.isOpen ? 'default' : 'secondary'} className={cn("px-3 py-1 font-bold", team.isOpen ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-300")}>
                  {team.isOpen ? '팀 빌딩 진행 중' : '팀 모집 마감됨'}
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={cn("h-9 font-bold bg-transparent border-slate-700 hover:bg-slate-800", team.isOpen ? "text-rose-400 border-rose-900/40" : "text-emerald-400 border-emerald-900/40")}
                  onClick={() => updateTeam(team.teamCode, { isOpen: !team.isOpen })}
                >
                  {team.isOpen ? <><Lock className="w-3.5 h-3.5 mr-2" /> 모집 즉시 마감</> : <><Unlock className="w-3.5 h-3.5 mr-2" /> 모집 다시 시작</>}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left: Invitation */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> 팀원 초대하기
                  </h4>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="email" 
                        placeholder="초대할 팀원의 이메일 입력" 
                        className="w-full h-11 bg-slate-800 border-slate-700 rounded-xl pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      />
                    </div>
                    <Button className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl">초대 발송</Button>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
                  <p className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <strong>Tip:</strong> 이메일을 통해 전송된 초대 링크를 클릭하면 즉시 팀원으로 합류됩니다.
                  </p>
                </div>
              </div>

              {/* Right: Member List (Demo) */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Users className="w-4 h-4" /> 현재 소속 팀원 ({team.memberCount}명)
                </h4>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 scrollbar-hide">
                   {[
                     { name: currentUser?.nickname || '본인', role: '팀장', email: currentUser?.email },
                     { name: '이프론트', role: '팀원', email: 'dev.lee@example.com' },
                     { name: '김기획', role: '팀원', email: 'pm.kim@example.com' }
                   ].map((member, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-[10px] font-black">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold">{member.name} <span className="text-[10px] text-slate-500 ml-1">({member.role})</span></p>
                            <p className="text-[10px] text-slate-500">{member.email}</p>
                          </div>
                        </div>
                        {member.role !== '팀장' && (
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-600 hover:text-rose-400 hover:bg-rose-900/20">
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        )}
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
