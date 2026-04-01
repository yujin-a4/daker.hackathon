'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Users, Heart, Trophy, ArrowRight } from 'lucide-react';
import { differenceInDays } from 'date-fns';

import type { Hackathon } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { getDday, formatDate, isExpired } from '@/lib/date';
import { getStatusColor, getGradientBySlug, cn } from '@/lib/utils';

interface HackathonListItemProps {
  hackathon: Hackathon;
}

export default function HackathonListItem({ hackathon }: HackathonListItemProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, toggleBookmark } = useUserStore();

  const isBookmarked = currentUser?.bookmarkedSlugs?.includes(hackathon.slug);
  const [color1, color2] = getGradientBySlug(hackathon.slug);

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
      title: isBookmarked ? '북마크를 제거했습니다.' : '북마크에 추가했습니다.',
    });
  };

  const dday = getDday(hackathon.period.endAt);
  const isDdayUrgent =
    !isExpired(hackathon.period.endAt) &&
    differenceInDays(new Date(hackathon.period.endAt), new Date()) <= 7;

  return (
    <div
      onClick={() => router.push(`/hackathons/${hackathon.slug}`)}
      className="group relative flex flex-col sm:flex-row sm:items-center border border-white/5 rounded-xl overflow-hidden bg-[#0A0A0A]/60 backdrop-blur-sm hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 cursor-pointer p-4 sm:p-5 gap-4"
    >
      {/* 바닥부 그라데이션 보더 효과 (Hover 시 강조) */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      
      {/* 왼쪽 색상 포인트 (간결화) */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(to bottom, ${color1}, ${color2})` }}
      />

      {/* 1. 상태 및 D-day 세션 (좌측 고정) */}
      <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-3 sm:gap-2.5 sm:w-28 flex-shrink-0">
        <Badge className={cn('font-bold text-[10px] sm:text-xs px-2 px-1.5', getStatusColor(hackathon.status))}>
          {statusText}
        </Badge>
        {hackathon.status !== 'ended' && (
          <div className={cn(
            'text-[10px] sm:text-xs font-bold tracking-wider px-2 py-0.5 rounded-md border',
            isDdayUrgent 
              ? 'text-rose-400 border-rose-500/30 bg-rose-500/10 animate-pulse' 
              : 'text-gray-400 border-white/10 bg-white/5'
          )}>
            {dday}
          </div>
        )}
      </div>

      {/* 2. 제목 및 태그 세션 (중앙 집중형) */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
            {hackathon.title}
          </h3>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">
            {hackathon.type}
          </span>
        </div>
        
        {/* 태그 (최대 3개 제한) */}
        <div className="flex flex-wrap gap-1.5">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] sm:text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5 group-hover:border-white/10 transition-colors"
            >
              #{tag}
            </span>
          ))}
          {hackathon.tags.length > 3 && (
            <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md text-gray-600 font-bold italic">
              +{hackathon.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* 3. 주요 지표 및 상호작용 (우측 고정) */}
      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 flex-shrink-0 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 mt-1 sm:mt-0">
        <div className="flex items-center gap-4 sm:gap-5 text-gray-400">
          <div className="flex flex-col sm:items-end gap-0.5">
            <span className="flex items-center gap-1 text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
              <Users className="w-2.5 h-2.5" /> Participants
            </span>
            <p className="text-xs sm:text-sm font-bold text-white italic">{hackathon.participantCount}명</p>
          </div>
          
          {hackathon.prizeTotal && (
            <div className="flex flex-col sm:items-end gap-0.5">
              <span className="flex items-center gap-1 text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                <Trophy className="w-2.5 h-2.5" /> Prize
              </span>
              <p className="text-xs sm:text-sm font-bold text-cyan-400">{hackathon.prizeTotal}</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-white/10 pl-5 ml-1">
          <motion.button
            whileTap={{ scale: 1.3 }}
            onClick={handleBookmarkClick}
            className="p-2 rounded-full hover:bg-white/10 transition-colors group/heart"
          >
            <Heart
              className={cn(
                'w-4 h-4 text-gray-600 transition-all',
                isBookmarked ? 'fill-rose-500 text-rose-500' : 'group-hover/heart:text-rose-400'
              )}
            />
          </motion.button>
          <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-primary group-hover:translate-x-1 transition-all hidden sm:block" />
        </div>
      </div>
    </div>

  );
}
