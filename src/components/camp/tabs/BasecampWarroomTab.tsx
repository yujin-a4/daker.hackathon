'use client';

import { useSubmissionStore } from '@/store/useSubmissionStore';
import { useUserStore } from '@/store/useUserStore';
import type { Team, Hackathon, TeamMemo } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, Clock, FileText, Globe, Presentation, ArrowRight, 
  Sparkles, UserPlus, UserMinus, ShieldCheck, Mail, Lock, Unlock, 
  Users, Layout, ClipboardList, PenTool, Lightbulb, Link as LinkIcon,
  Zap, BookOpen, Activity, Plus, Trash2, ExternalLink, StickyNote,
  AlertCircle, ChevronRight, Target, TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/date';
import { useTeamStore } from '@/store/useTeamStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useMemo } from 'react';
import { generateAiWarroomContent } from '@/app/actions/ai-checklist';
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
  const { hackathonDetails } = useHackathonStore();
  const { 
    updateTeam, 
    setAiChecklist, 
    setAiStrategy, 
    toggleAiChecklistItem, 
    addTeamMemo, 
    removeTeamMemo 
  } = useTeamStore();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newMemo, setNewMemo] = useState({ title: '', content: '' });
  const [showMemoForm, setShowMemoForm] = useState(false);

  const role = currentUser?.role || '팀원';
  const currentPhase = team.progressStatus || 'planning';
  const detail = hackathonDetails[hackathon.slug];

  // AI Content Generation logic
  useEffect(() => {
    const shouldGenerate = !team.aiChecklists?.[currentPhase] || !team.aiStrategy?.[currentPhase];
    
    if (shouldGenerate && detail && !isAnalyzing) {
      handleGenerateAiContent();
    }
  }, [currentPhase, detail, team.teamCode]);

  const handleGenerateAiContent = async () => {
    if (!detail) return;
    setIsAnalyzing(true);
    try {
      const result = await generateAiWarroomContent(detail, currentPhase);
      if (result) {
        setAiStrategy(team.teamCode, currentPhase, result.strategy);
        const checklistWithCompletion = result.checklist.map(item => ({
          ...item,
          completed: false
        }));
        setAiChecklist(team.teamCode, currentPhase, checklistWithCompletion);
      }
    } catch (err) {
      console.error('AI Strategy generation failed', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* --- War Room Header --- */}
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
            {hackathon.title} 대회의 성공적인 완주를 위해 AI 전략가가 실시간 미션 분석을 수행합니다.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 relative z-10 min-w-[200px]">
           <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
             <span>전체 공정률</span>
             <span className="text-indigo-400">{team.progressPercent || 0}%</span>
           </div>
           <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${team.progressPercent || 0}%` }}
               className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
             />
           </div>
           <Button 
            onClick={() => router.push(`/hackathons/${hackathon.slug}?tab=submit`)}
            className="mt-2 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl shadow-lg shadow-white/5"
          >
            최종 제출하기 <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* --- Left Column (Strategy & Checklist) --- */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Strategy Card */}
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 border-none shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-32 h-32" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-200" />
                <h3 className="font-black text-sm uppercase tracking-widest">Winning Strategy</h3>
              </div>
              {isAnalyzing && <div className="w-2 h-2 bg-indigo-200 rounded-full animate-ping" />}
            </div>
            
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <div className="h-4 bg-white/20 rounded-md animate-pulse w-full" />
                  <div className="h-4 bg-white/20 rounded-md animate-pulse w-3/4" />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 overflow-y-auto max-h-[140px] scrollbar-hide pr-1"
                >
                  <p className="text-sm font-bold leading-tight text-indigo-50">
                    {team.aiStrategy?.[currentPhase] || "미션을 분석하고 승리 전략을 도출하는 중입니다..."}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleGenerateAiContent}
                    className="mt-2 p-0 h-auto text-[10px] font-black text-white/50 hover:text-white uppercase tracking-tighter"
                  >
                    전략 다시 분석하기 &or;
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* AI Checklist Card */}
          <Card className="p-6 border-2 border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <ClipboardList className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Mission Checklist</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">AI Recommended</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] font-black">{currentPhase.toUpperCase()}</Badge>
            </div>

            <div className="space-y-3 min-h-[200px] max-h-[460px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              {isAnalyzing ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse flex-1" />
                  </div>
                ))
              ) : (
                <ul className="space-y-3">
                  {(team.aiChecklists?.[currentPhase] || []).map((item) => (
                    <motion.li 
                      key={item.id}
                      whileHover={{ x: 2 }}
                      onClick={() => toggleAiChecklistItem(team.teamCode, currentPhase, item.id)}
                      className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-md border-2 mt-0.5 flex-shrink-0 flex items-center justify-center transition-all",
                        item.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-700 group-hover:border-emerald-400"
                      )}>
                        {item.completed && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                      <span className={cn(
                        "text-xs font-medium leading-tight",
                        item.completed ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-200"
                      )}>
                        {item.text}
                      </span>
                    </motion.li>
                  ))}
                  {(!team.aiChecklists?.[currentPhase]) && !isAnalyzing && (
                    <div className="text-center py-8">
                       <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                       <p className="text-[11px] text-muted-foreground font-medium">분석 데이터가 없습니다.<br/>위의 전략 분석 버튼을 눌러주세요.</p>
                    </div>
                  )}
                </ul>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
               <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mb-2">
                 <span>Phase Progress</span>
                 <span>{Math.round(((team.aiChecklists?.[currentPhase]?.filter(i => i.completed).length || 0) / (team.aiChecklists?.[currentPhase]?.length || 1)) * 100)}%</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${((team.aiChecklists?.[currentPhase]?.filter(i => i.completed).length || 0) / (team.aiChecklists?.[currentPhase]?.length || 1)) * 100}%` }}
                 />
               </div>
            </div>
          </Card>
        </div>

        {/* --- Middle/Right Column (Timeline, Memos, Submission) --- */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress Selector Card */}
            <Card className="p-6 border-2 border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="font-bold text-sm">Phase Control</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 flex-1">
                {[
                  { id: 'planning', label: '기획', p: 20 },
                  { id: 'designing', label: '디자인', p: 40 },
                  { id: 'developing', label: '개발', p: 80 },
                  { id: 'completed', label: '완료', p: 100 },
                ].map((step) => (
                  <Button
                    key={step.id}
                    variant={team.progressStatus === step.id ? "default" : "outline"}
                    onClick={() => handleProgressChange(step.id as any, step.p)}
                    className={cn(
                      "h-16 flex flex-col items-center justify-center gap-1 rounded-2xl border-2 transition-all",
                      team.progressStatus === step.id ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200" : "hover:border-indigo-200"
                    )}
                  >
                    <span className="text-xs font-black">{step.label}</span>
                    <span className="text-[9px] opacity-60 uppercase font-bold">{step.id}</span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Team Memo Pad Card */}
            <Card className="p-6 border-2 border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full bg-amber-50/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <StickyNote className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-sm">Team Memo Pad</h3>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-600" onClick={() => setShowMemoForm(!showMemoForm)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px] scrollbar-hide">
                <AnimatePresence>
                  {showMemoForm && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 mb-4"
                    >
                      <Input 
                        placeholder="제목 (예: Figma 링크)" 
                        className="text-xs h-8" 
                        value={newMemo.title}
                        onChange={e => setNewMemo({...newMemo, title: e.target.value})}
                      />
                      <Textarea 
                        placeholder="카드 내용 또는 URL" 
                        className="text-xs min-h-[60px]" 
                        value={newMemo.content}
                        onChange={e => setNewMemo({...newMemo, content: e.target.value})}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 h-8 text-[11px] font-bold" onClick={() => {
                          if (newMemo.title || newMemo.content) {
                            addTeamMemo(team.teamCode, newMemo);
                            setNewMemo({ title: '', content: '' });
                            setShowMemoForm(false);
                          }
                        }}>저장</Button>
                        <Button size="sm" variant="ghost" className="h-8 text-[11px]" onClick={() => setShowMemoForm(false)}>취소</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {(team.teamMemos || []).length === 0 && !showMemoForm && (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                    <PenTool className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-[11px] font-medium">중요한 정보나 링크를 기록하세요.</p>
                  </div>
                )}

                {(team.teamMemos || []).map((memo) => (
                   <motion.div 
                    layout
                    key={memo.id}
                    className="p-3 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-xl shadow-sm relative group"
                   >
                     <button 
                      onClick={() => removeTeamMemo(team.teamCode, memo.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
                     >
                       <Trash2 className="w-3 h-3" />
                     </button>
                     <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                       {memo.title}
                       {memo.content.startsWith('http') && <ExternalLink className="w-2.5 h-2.5 text-indigo-400" />}
                     </h4>
                     <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 break-all">{memo.content}</p>
                   </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Submission Hub Section */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-slate-400">
                  <Layout className="w-4 h-4" /> Work Submission Hub
                </h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {submissionCards.map((card) => {
                  const Icon = card.icon;
                  const isDone = card.isSubmitted;
                  
                  return (
                    <Card 
                      key={card.id} 
                      onClick={() => router.push(`/hackathons/${hackathon.slug}?tab=submit`)}
                      className={cn(
                        "p-5 flex flex-col items-center gap-3 border-2 transition-all cursor-pointer hover:scale-[1.02]",
                        isDone ? "bg-emerald-50/30 border-emerald-500/20 shadow-emerald-100/10" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-2xl",
                        isDone ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-black mb-0.5">{card.title}</p>
                        <p className="text-[9px] uppercase tracking-tighter font-bold text-slate-400">
                          {isDone ? 'Submitted' : 'Pending'}
                        </p>
                      </div>
                    </Card>
                  );
                })}
             </div>
          </div>

          {/* Role Tip & Quick Facts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/50 flex gap-4 items-center">
              <div className="p-2 bg-indigo-500 rounded-xl text-white">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-0.5">Today's Tip for {role}</h4>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {role.includes('개발') ? "GitHub 협업 컨벤션을 팀원들과 합의하여 코드 리뷰 효율을 높이세요." : 
                   role.includes('디자인') ? "사용자 여정 지도(User Journey)를 먼저 그려 UX 논리를 강화하세요." :
                   "평가 기준 중 '실무 활용도'가 가장 높으니, 비즈니스 가치를 수치로 증명하세요."}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between border border-slate-800">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Clock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Deadline Count</p>
                    <p className="text-sm font-black">D-{Math.ceil((new Date(hackathon.period.submissionDeadlineAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</p>
                  </div>
               </div>
               <div className="h-10 w-px bg-slate-800" />
               <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Phase Point</p>
                  <p className="text-sm font-black text-indigo-400">+50 XP</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
