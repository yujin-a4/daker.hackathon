'use client'

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Users, Heart, Timer, ArrowRight } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { useEffect, useState } from 'react';

import type { Hackathon } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getDday, formatDate, isExpired } from '@/lib/date';
import { getStatusColor, getGradientBySlug, cn } from '@/lib/utils';

interface HackathonCardProps {
  hackathon: Hackathon;
}

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, toggleBookmark } = useUserStore();
  const [progress, setProgress] = useState(0);
  
  const [color1, color2] = getGradientBySlug(hackathon.slug);
  const isBookmarked = currentUser?.bookmarkedSlugs?.includes(hackathon.slug);

  let statusText = '';
  switch (hackathon.status) {
    case 'ongoing': statusText = '진행중'; break;
    case 'upcoming': statusText = '예정'; break;
    case 'ended': statusText = '종료'; break;
  }

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(hackathon.slug);
    toast({
      title: isBookmarked ? "북마크를 제거했습니다." : "북마크에 추가했습니다.",
    });
  };

  const dday = getDday(hackathon.period.submissionDeadlineAt);
  const daysLeft = differenceInDays(new Date(hackathon.period.submissionDeadlineAt), new Date());
  const isDdayUrgent = !isExpired(hackathon.period.submissionDeadlineAt) && daysLeft <= 7;

  // 시니어의 팁: 가상의 진행률 계산 (마감일 기준 역산)
  useEffect(() => {
    if (hackathon.status === 'ended') {
      setProgress(100);
    } else if (hackathon.status === 'upcoming') {
      setProgress(0);
    } else {
      // 진행중인 경우: 30일을 전체 기간으로 가정하고 남은 시간으로 진행률 시각화
      const maxDays = 30;
      const calculatedProgress = Math.max(0, Math.min(100, ((maxDays - Math.max(0, daysLeft)) / maxDays) * 100));
      setProgress(calculatedProgress);
    }
  }, [hackathon.status, daysLeft]);

  return (
    <Card
      className="group relative flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border bg-white dark:bg-[#0D0D0D] border-slate-100 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:shadow-[0_20px_40px_-20px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_0_40px_-20px_rgba(99,102,241,0.3)]"
      onClick={() => router.push(`/hackathons/${hackathon.slug}`)}
    >
      {/* 1. 최상단 그라데이션 보더 포인트 */}
      <div 
        className="absolute top-0 inset-x-0 h-[3px] z-10"
        style={{ background: 'linear-gradient(to right, #6366F1, #06B6D4)' }}
      />

      <div className="p-5 flex flex-col h-full gap-4">
        {/* 2 & 3. 헤더 및 상태 배지 (컴팩트) */}
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-4">
            <h4 className="text-base font-bold leading-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              {hackathon.title}
            </h4>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBookmarkClick}
              className="flex-shrink-0 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-muted-foreground transition-colors"
            >
              <Heart className={cn("w-4 h-4", isBookmarked ? "fill-rose-500 text-rose-500" : "fill-transparent")} />
            </motion.button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn('font-bold text-[10px] uppercase tracking-wider', getStatusColor(hackathon.status))}>
              {statusText}
            </Badge>
            <Badge variant="outline" className="text-[10px] font-medium border-slate-200 dark:border-white/10 text-muted-foreground bg-slate-50/50 dark:bg-transparent">
              {hackathon.type}
            </Badge>
            {hackathon.status !== 'ended' && (
              <div className={cn(
                'text-[10px] font-bold px-2 py-0.5 rounded border',
                isDdayUrgent ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 'text-muted-foreground border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-transparent'
              )}>
                {dday}
              </div>
            )}
          </div>
        </div>

        {/* 4. 해시태그 (최대 3개) */}
        <div className="flex flex-wrap gap-1.5">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              #{tag}
            </span>
          ))}
          {hackathon.tags.length > 3 && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500/60 font-bold italic">
              +{hackathon.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex-grow" />

        {/* 5. 진행률 (미니멀하게 유지) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-slate-400 dark:text-slate-500">
            <span>Progress</span>
            <span className={cn("font-black", isDdayUrgent ? "text-rose-500" : "text-indigo-600 dark:text-indigo-400")}>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                hackathon.status === 'ended' ? "bg-slate-300 dark:bg-muted-foreground" : isDdayUrgent ? "bg-rose-500" : "bg-gradient-to-r from-indigo-500 to-cyan-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 6. 푸터: 참여자 및 기간 */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between font-medium">
          <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 opacity-70" />
              <span>{hackathon.participantCount || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 opacity-70" />
              <span>~{formatDate(hackathon.period.submissionDeadlineAt)}</span>
            </div>
          </div>
          
          <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Card>


  );
}
