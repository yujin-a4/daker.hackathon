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

  const dday = getDday(hackathon.period.submissionDeadlineAt);
  const isDdayUrgent =
    !isExpired(hackathon.period.submissionDeadlineAt) &&
    differenceInDays(new Date(hackathon.period.submissionDeadlineAt), new Date()) <= 7;

  return (
    <div
      onClick={() => router.push(`/hackathons/${hackathon.slug}`)}
      className="group flex items-stretch border rounded-xl overflow-hidden bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer"
    >
      {/* 왼쪽 그라데이션 바 */}
      <div
        className="w-1.5 flex-shrink-0"
        style={{ background: `linear-gradient(to bottom, ${color1}, ${color2})` }}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 min-w-0 px-4 sm:px-5 py-4">
        {/* 상단: 상태 + 유형 + D-day */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn('font-semibold text-xs', getStatusColor(hackathon.status))}>
              {statusText}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              {hackathon.type}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {hackathon.status !== 'ended' && (
              <Badge
                className={cn(
                  'font-semibold text-xs',
                  isDdayUrgent
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {dday}
              </Badge>
            )}
            <motion.button
              whileTap={{ scale: 1.2 }}
              onClick={handleBookmarkClick}
              className="p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Bookmark hackathon"
            >
              <Heart
                className={cn(
                  'w-4 h-4 text-muted-foreground',
                  isBookmarked && 'fill-red-500 text-red-500'
                )}
              />
            </motion.button>
          </div>
        </div>

        {/* 제목 */}
        <h3 className="text-base sm:text-lg font-semibold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {hackathon.title}
        </h3>

        {/* 태그 */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {hackathon.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {hackathon.tags.length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              +{hackathon.tags.length - 4}
            </span>
          )}
        </div>

        {/* 하단: 참여자 / 상금 / 마감일 / 상세 링크 */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {hackathon.participantCount}명
            </span>
            {hackathon.prizeTotal && (
              <span className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                {hackathon.prizeTotal}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              제출 마감 ~{formatDate(hackathon.period.submissionDeadlineAt)}
            </span>
          </div>
          <span className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
            상세보기 <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
