'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Zap, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import TeamCard from '@/components/camp/TeamCard';
import type { Team } from '@/types';
import type { MatchingResult } from '@/lib/matching';
import { cn } from '@/lib/utils';

interface RecommendedTeamSectionProps {
  recommendations: MatchingResult[];
  onEdit: (team: Team) => void;
  handleCardClick: (team: Team) => void;
  userNickname?: string;
}

export default function RecommendedTeamSection({
  recommendations,
  onEdit,
  handleCardClick,
  userNickname = '회원',
}: RecommendedTeamSectionProps) {
  if (recommendations.length === 0) return null;

  return (
    <section className="relative py-8 px-1">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[95%] h-full bg-amber-500/5 dark:bg-amber-500/10 blur-3xl -z-10 rounded-full" />
      
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 dark:bg-amber-900/50 p-1 rounded-md">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 fill-amber-500/20" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-50 italic">
              AI 전술 매칭 추천
            </h2>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-slate-400 hover:text-amber-500 transition-colors ml-1">
                  <Info className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-sm">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    추천 매칭 점수 산정 방식
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    프로필에 등록된 정보를 바탕으로 AI가 최적의 팀을 추천합니다.
                  </p>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside mt-2">
                    <li><strong>포지션 및 역할</strong>: 유저의 역할과 찾는 포지션이 일치하면 대폭 점수가 부여됩니다.</li>
                    <li><strong>기술 스택 & 분야</strong>: 유저의 스택 및 도메인 관심사와 팀의 요건이 겹칠수록 가산점이 부여됩니다.</li>
                    <li><strong>마감 임박</strong>: 팀의 정원 대비 현재 멤버가 가득 찰수록 가산점이 부여됩니다.</li>
                    <li><strong>신규 모집</strong>: 가장 최근(3일 내)에 생성되어 활성화 된 팀에게 가산점이 부여됩니다.</li>
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium ml-1">
            {userNickname}님의 프로필을 분석하여 <span className="text-amber-600 dark:text-amber-400 font-bold">최적의 시너지를 낼 팀</span>을 선별했습니다.
          </p>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-6 overflow-x-auto pt-5 pb-6 scrollbar-hide snap-x snap-mandatory px-2">
        {recommendations.map((match, i) => (
          <motion.div
            key={match.team.teamCode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex-shrink-0 w-[300px] sm:w-[350px] snap-center group flex flex-col items-stretch"
          >
            <div className="relative flex flex-col flex-1 h-full">
              {/* Match Score Badge */}
              <div className="absolute -top-3 -right-2 z-20">
                <Badge className="bg-amber-500 hover:bg-amber-600 border-2 border-white dark:border-slate-950 text-white font-black px-2 py-1 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                   {match.score}% MATCH
                </Badge>
              </div>

              {/* Glowing Outline on Hover */}
              <div className="absolute inset-x-0 inset-y-0 rounded-2xl bg-amber-500/0 group-hover:bg-amber-500/20 blur-xl transition-all duration-300 -z-10" />

              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-amber-500/30 group-hover:border-amber-500 transition-colors shadow-sm flex flex-col flex-1 overflow-hidden h-full">
                <div className="flex-1 shrink-0">
                  <TeamCard 
                    team={match.team} 
                    onEdit={onEdit} 
                    onCardClick={handleCardClick}
                    className="border-0 shadow-none rounded-none hover:border-0 hover:shadow-none bg-transparent"
                  />
                </div>
                
                {/* AI Insights Bar */}
                <div className="mt-auto px-4 py-3 bg-amber-50/50 dark:bg-amber-900/10 border-t border-amber-100 dark:border-amber-900/40 shrink-0">
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-500" /> AI Insight
                    </p>
                    <div className="space-y-1.5 font-medium">
                      {match.matchReasons.map((reason, j) => (
                        <div key={j} className="flex items-start gap-2 text-[12px] text-slate-700 dark:text-slate-300">
                          <span className="mt-1 text-amber-500 font-bold shrink-0">·</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Placeholder for "More" */}
        <div className="flex-shrink-0 w-20 flex items-center justify-center snap-center">
            <div className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors group">
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
        </div>
      </div>
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
