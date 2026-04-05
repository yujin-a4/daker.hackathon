'use client';

import { motion } from 'framer-motion';
import { Target, CheckCircle2, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { analyzeHackathonMatch } from '@/lib/match-analysis';
import { calculateHackathonMatchScore } from '@/lib/recommend';
import type { Hackathon, CurrentUser } from '@/types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface MatchAnalysisCardProps {
  hackathon: Hackathon;
  currentUser: CurrentUser | null;
}

export default function MatchAnalysisCard({ hackathon, currentUser }: MatchAnalysisCardProps) {
  const analysis = analyzeHackathonMatch(hackathon, currentUser);
  // 추천 섹션과 동일한 알고리즘으로 점수 계산
  const matchRate = calculateHackathonMatchScore(hackathon, currentUser);

  if (!analysis) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-muted-foreground text-center">
          프로필을 설정하면 <br /> 나에게 맞는 정도를 분석해 드립니다.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500 rounded-lg">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-tight">AI Matcher</h4>
          </div>
          <span className={cn(
            "text-lg font-black",
            matchRate >= 70 ? "text-emerald-500" : matchRate >= 40 ? "text-indigo-500" : "text-amber-500"
          )}>
            {matchRate}%
          </span>
        </div>
        
        <Progress value={matchRate} className="h-2 bg-slate-200 dark:bg-slate-800" />
        <p className="text-[11px] text-muted-foreground mt-2 font-medium">
          현재 보유하신 스택과 대회 태그를 분석한 결과입니다.
        </p>
      </div>

      <div className="p-5 space-y-5">
        {/* Suggested Role */}
        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">추천 역할</span>
          </div>
          <p className="text-sm font-black text-slate-900 dark:text-slate-100">{analysis.suggestedRole}</p>
          <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mt-0.5 leading-relaxed">
            {analysis.roleDescription}
          </p>
        </div>

        {/* Missing Skills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
             <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">보유한 기술 스택</span>
             <span className="text-[10px] font-bold text-emerald-500">{analysis.matchedSkills.length}/{hackathon.tags.length}</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {analysis.matchedSkills.map(skill => (
              <div key={skill} className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 rounded-md text-[10px] font-bold">
                <CheckCircle2 className="w-2.5 h-2.5" />
                {skill}
              </div>
            ))}
            {analysis.missingSkills.map(skill => (
              <div key={skill} className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800 rounded-md text-[10px] font-bold">
                <AlertCircle className="w-2.5 h-2.5" />
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
          <Sparkles className="w-3 h-3 inline-block mr-1 text-amber-500" />
          {matchRate >= 60 ? "지금 바로 팀 빌딩을 시작해 보세요!" : "함께 프로젝트를 이끌어갈 팀원을 찾아보세요."}
        </p>
      </div>
    </div>
  );
}
