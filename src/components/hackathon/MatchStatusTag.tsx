import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  UserPlus, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  BrainCircuit
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { analyzeHackathonMatch } from '@/lib/match-analysis';
import type { Hackathon, CurrentUser } from '@/types';
import { cn } from '@/lib/utils';

interface MatchStatusTagProps {
  hackathon: Hackathon;
  currentUser: CurrentUser | null;
}

export default function MatchStatusTag({ hackathon, currentUser }: MatchStatusTagProps) {
  const [isOpen, setIsOpen] = useState(false);
  const analysis = analyzeHackathonMatch(hackathon, currentUser);

  if (!currentUser || !analysis) return null;

  const { 
    matchRate, 
    suggestedRole, 
    matchedSkills, 
    missingSkills, 
    roleDescription,
    neededTeamRoles 
  } = analysis;

  // 점수에 따른 색상 테마 결정
  const getThemeColor = () => {
    if (matchRate >= 70) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (matchRate >= 40) return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
    return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setIsOpen(true)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black transition-all cursor-pointer shadow-sm relative overflow-hidden",
            getThemeColor()
          )}
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>{matchRate}% Match</span>
        </motion.button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[320px] p-0 overflow-hidden border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl" 
        sideOffset={12}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                <BrainCircuit className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">AI Match Analysis</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black">{matchRate}%</span>
            </div>
          </div>
          
          <Progress value={matchRate} className="h-1.5 bg-white/20" />
          <p className="text-[11px] mt-3 font-medium opacity-90 leading-relaxed min-h-[32px]">
            "{currentUser.nickname}님은 이 대회에서 <span className="font-bold underline decoration-indigo-300 underline-offset-2">{suggestedRole}</span> 역할로 가장 빛날 수 있습니다."
          </p>
        </div>

        <div className="p-5 space-y-6 bg-white dark:bg-slate-950">
          {/* Skills Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Skill Alignment</span>
              <span className="text-[10px] font-bold text-indigo-500">{matchedSkills.length} Matched</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.slice(0, 4).map(skill => (
                <div key={skill} className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 rounded-md text-[10px] font-bold">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {skill}
                </div>
              ))}
              {missingSkills.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800 rounded-md text-[10px] font-bold">
                  <AlertCircle className="w-2.5 h-2.5" />
                  +{missingSkills.length} more
                </div>
              )}
            </div>
          </div>

          {/* Needed Partners */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">추천 파트너</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {neededTeamRoles.map(role => (
                <Badge key={role} variant="outline" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-[10px]">
                  {role}
                </Badge>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
              부족한 스택을 채워줄 위 포지션의 팀원을 찾아보세요!
            </p>
          </div>

          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors group">
            <span className="text-xs font-bold">팀 빌딩 시작하기</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}


