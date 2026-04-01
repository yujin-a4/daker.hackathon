'use client';

import { useSubmissionStore } from '@/store/useSubmissionStore';
import { useUserStore } from '@/store/useUserStore';
import type { Team, Hackathon } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Clock, FileText, Globe, Presentation, ArrowRight, 
  Activity, Plus, Trash2, ExternalLink, StickyNote,
  TrendingUp, Layout, Lightbulb, PenTool, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeamStore } from '@/store/useTeamStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
  const { 
    updateTeam, 
    addTeamMemo, 
    removeTeamMemo 
  } = useTeamStore();
  
  const [newMemo, setNewMemo] = useState({ title: '', content: '' });
  const [showMemoForm, setShowMemoForm] = useState(false);

  const role = currentUser?.role || '팀원';

  const handleProgressChange = (status: 'planning' | 'designing' | 'developing' | 'completed', percent: number) => {
    updateTeam(team.teamCode, { progressStatus: status, progressPercent: percent });
  };

  const mySubmission = submissions.find(
    (s) => s.teamCode === team.teamCode && s.hackathonSlug === hackathon.slug
  );

  const isPlanDone = mySubmission?.artifacts?.some(a => a.type === 'text' && a.content && a.content.length > 0);
  const isWebDone = mySubmission?.artifacts?.some(a => a.type === 'url' && a.content && a.content.length > 0);
  const isPptDone = mySubmission?.artifacts?.some(a => a.fileName);

  const submissionCards = [
    { id: 'plan', title: '기획서', icon: FileText, isSubmitted: isPlanDone },
    { id: 'web', title: '웹링크', icon: Globe, isSubmitted: isWebDone },
    { id: 'ppt', title: 'PPT', icon: Presentation, isSubmitted: isPptDone },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* 1. 작전실 헤더 (공정률 대시보드) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
             <Badge className="bg-indigo-500 hover:bg-indigo-600 text-[10px] uppercase tracking-widest font-black py-0.5">Control Center</Badge>
             <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
               <Activity className="w-3 h-3 animate-pulse" /> LIVE
             </div>
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">작전실: {team.name}</h2>
          <p className="text-slate-400 text-sm max-w-md font-medium leading-relaxed">
            {hackathon.title} 대회의 성공적인 완주를 위해 실시간 미션 현황을 관리하고 협업하세요.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 relative z-10 min-w-[240px]">
           <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">
             <span>전체 공정률</span>
             <span className="text-indigo-400">{team.progressPercent || 0}%</span>
           </div>
           <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${team.progressPercent || 0}%` }}
               className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
             />
           </div>
           <Button 
            onClick={() => router.push(`/hackathons/${hackathon.slug}?tab=submit`)}
            className="mt-2 bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl shadow-lg shadow-white/5 h-11"
          >
            최종 결과물 제출하기 <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* 2. 진행 단계 컨트롤 (가로형) */}
      <Card className="p-8 border-2 border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem]">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg">진행 상황 추적기</h3>
            <p className="text-xs text-muted-foreground font-medium">현재 아웃풋 단계를 설정하여 팀의 진행 상황을 동기화하세요.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'planning', label: '기획 단계', p: 20, desc: '아이디어 정의 및 설계' },
            { id: 'designing', label: '디자인 단계', p: 40, desc: '와이어프레임 및 UI 구축' },
            { id: 'developing', label: '개발 단계', p: 80, desc: '기능 구현 및 배포' },
            { id: 'completed', label: '마무리 단계', p: 100, desc: '제출 및 최종 검증' },
          ].map((step) => (
            <Button
              key={step.id}
              variant={team.progressStatus === step.id ? "default" : "outline"}
              onClick={() => handleProgressChange(step.id as any, step.p)}
              className={cn(
                "h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden",
                team.progressStatus === step.id 
                  ? "bg-indigo-600 border-indigo-600 shadow-2xl shadow-indigo-200 text-white scale-[1.03]" 
                  : "hover:border-indigo-200 bg-white dark:bg-slate-900"
              )}
            >
              <span className="text-sm font-black relative z-10">{step.label}</span>
              <span className="text-[10px] opacity-70 font-bold relative z-10">{step.desc}</span>
              {team.progressStatus === step.id && (
                <motion.div 
                  layoutId="activeStep"
                  className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 -z-0"
                />
              )}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 팀 메모 패드 */}
        <div className="lg:col-span-8">
          <Card className="p-8 border-2 border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full bg-amber-50/5 rounded-[2rem]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 rounded-xl">
                  <StickyNote className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">팀 공유 메모장</h3>
                  <p className="text-xs text-muted-foreground font-medium">실시간으로 기획 내용이나 URL을 공유하세요.</p>
                </div>
              </div>
              <Button size="icon" variant="outline" className="h-10 w-10 text-amber-600 border-amber-200 rounded-xl hover:bg-amber-50" onClick={() => setShowMemoForm(!showMemoForm)}>
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 max-h-[400px] scrollbar-hide pr-1">
              <AnimatePresence>
                {showMemoForm && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3 mb-6 p-5 bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-amber-900/30 rounded-2xl shadow-xl border-dashed"
                  >
                    <Input 
                      placeholder="제목 (예: Figma 링크)" 
                      className="text-xs h-10 rounded-xl border-slate-200" 
                      value={newMemo.title}
                      onChange={e => setNewMemo({...newMemo, title: e.target.value})}
                    />
                    <Textarea 
                      placeholder="내용 또는 URL을 입력하세요..." 
                      className="text-xs min-h-[100px] rounded-xl resize-none border-slate-200" 
                      value={newMemo.content}
                      onChange={e => setNewMemo({...newMemo, content: e.target.value})}
                    />
                    <div className="flex gap-2">
                      <Button className="flex-1 h-10 text-xs font-black rounded-xl bg-amber-600 hover:bg-amber-700" onClick={() => {
                        if (newMemo.title || newMemo.content) {
                          addTeamMemo(team.teamCode, newMemo);
                          setNewMemo({ title: '', content: '' });
                          setShowMemoForm(false);
                        }
                      }}>메모 저장</Button>
                      <Button variant="ghost" className="h-10 text-xs font-bold rounded-xl" onClick={() => setShowMemoForm(false)}>취소</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {(team.teamMemos || []).length === 0 && !showMemoForm && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                  <PenTool className="w-14 h-14 mb-4 opacity-20" />
                  <p className="text-sm font-bold">공유된 메모가 없습니다.</p>
                  <p className="text-xs opacity-60">기획 아이디어나 레퍼런스를 기록해보세요.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(team.teamMemos || []).map((memo) => (
                   <motion.div 
                    layout
                    key={memo.id}
                    className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm relative group hover:border-amber-400 transition-all hover:shadow-md"
                   >
                     <button 
                      onClick={() => removeTeamMemo(team.teamCode, memo.id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 transition-all"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                     <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2 pr-6">
                       {memo.title}
                       {memo.content.startsWith('http') && <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />}
                     </h4>
                     <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3 break-all leading-relaxed">{memo.content}</p>
                   </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* 결과물 제출 현황 (측면 섹션) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <Card className="p-8 border-2 border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] flex-1">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                  <Layout className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-lg">제출 허브</h3>
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
                        "p-5 flex items-center gap-4 border-2 transition-all duration-300 cursor-pointer hover:shadow-lg rounded-2xl",
                        isDone ? "bg-emerald-50/30 border-emerald-500/20" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-xl",
                        isDone ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black">{card.title}</p>
                        <p className={cn("text-[10px] uppercase font-black", isDone ? "text-emerald-600" : "text-slate-400")}>
                          {isDone ? 'COMPLETED' : 'PENDING'}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  );
                })}
             </div>
           </Card>

           {/* 카운트다운 카드 */}
           <div className="bg-slate-900 text-white rounded-[2rem] p-8 flex flex-col justify-between border border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Clock className="w-20 h-20" />
              </div>
              <div className="mb-6">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Release Countdown</p>
                <p className="text-4xl font-black tracking-tighter">
                  D-{Math.ceil((new Date(hackathon.period.submissionDeadlineAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-400">예상 획득 포인트</p>
                <p className="text-xl font-black text-indigo-400">+50 XP</p>
              </div>
           </div>
        </div>
      </div>

      {/* 하단 팁 */}
      <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2rem] p-6 border-2 border-indigo-100/50 dark:border-indigo-900/30 flex flex-col md:flex-row gap-6 items-center">
        <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg">
          <Lightbulb className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">{role} 협업 팁</h4>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {role.includes('개발') ? "GitHub 협업 컨벤션을 팀원들과 합의하여 코드 리뷰 효율을 높여보세요." : 
             role.includes('디자인') ? "사용자 여정 지도(User Journey)를 먼저 그려보며 디자인 논리를 강화하세요." :
             "평가 기준 중 '실무 활용도'가 비중이 크니, 비즈니스 가치를 숫자로 증명하는 데 집중하세요."}
          </p>
        </div>
      </div>
    </div>
  );
}
