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
      className="group flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer border bg-card"
      onClick={() => router.push(`/hackathons/${hackathon.slug}`)}
    >
      {/* 1. 썸네일/그라데이션 영역 */}
      <div
        className="relative flex items-center justify-center h-44 w-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
        
        <h3 className="text-white/20 dark:text-black/20 text-5xl font-extrabold text-center break-all px-4 select-none transform group-hover:scale-105 transition-transform duration-500">
          {hackathon.title.substring(0, 10)}...
        </h3>
        
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={cn('font-semibold text-xs shadow-sm', getStatusColor(hackathon.status))}>
            {statusText}
          </Badge>
          {hackathon.status !== 'ended' && (
            <Badge className={cn(
              'font-semibold text-xs flex items-center gap-1 shadow-sm', 
              isDdayUrgent 
                ? 'bg-rose-500 text-white border-none animate-pulse' 
                : 'bg-white/90 text-slate-800 border-none'
            )}>
              <Timer className="w-3 h-3" />
              {dday}
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleBookmarkClick}
            className="bg-black/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-black/40 transition-colors shadow-sm"
            aria-label="Bookmark hackathon"
          >
            <Heart className={cn("w-4 h-4 transition-colors", isBookmarked ? "fill-rose-500 text-rose-500" : "fill-transparent")} />
          </motion.button>
        </div>
      </div>

      {/* 2. 콘텐츠 영역 */}
      <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-transparent to-muted/10">
        <h4 className="text-lg font-bold line-clamp-2 h-[56px] leading-snug text-foreground group-hover:text-primary transition-colors">
          {hackathon.title}
        </h4>
        
        {/* 3. 해시태그 칩 (UI 개선) */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
              #{tag}
            </span>
          ))}
          {hackathon.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border">
              +{hackathon.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex-grow min-h-[1rem]" />

        {/* 4. 프로그레스 바 (신규 추가) */}
        <div className="mt-4 mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground font-medium">
              {hackathon.status === 'ended' ? '진행 완료' : '마감 진행률'}
            </span>
            <span className={cn("font-bold", isDdayUrgent ? "text-rose-500" : "text-primary")}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full transition-colors duration-300",
                hackathon.status === 'ended' ? "bg-slate-400" : isDdayUrgent ? "bg-rose-500" : "bg-primary"
              )}
            />
          </div>
        </div>

        {/* 5. 푸터 영역 */}
        <div className="pt-4 border-t flex text-xs text-muted-foreground justify-between items-center">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>~{formatDate(hackathon.period.endAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{hackathon.participantCount || 0}명 참여중</span>
            </div>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Card>
  );
}
