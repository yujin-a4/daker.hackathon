'use client'

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Users, Heart } from 'lucide-react';
import { differenceInDays } from 'date-fns';

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
  const isDdayUrgent = !isExpired(hackathon.period.submissionDeadlineAt) && differenceInDays(new Date(hackathon.period.submissionDeadlineAt), new Date()) <= 7;

  return (
    <Card
      className="flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-[1.01] hover:border-border cursor-pointer border bg-card"
      onClick={() => router.push(`/hackathons/${hackathon.slug}`)}
    >
      <div
        className="relative flex items-center justify-center h-40 w-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
      >
        <h3 className="text-white/15 dark:text-black/15 text-5xl font-extrabold text-center break-all px-4 select-none">
          {hackathon.title}
        </h3>
        
        <div className="absolute top-3 left-3">
          <Badge className={cn('font-semibold text-xs', getStatusColor(hackathon.status))}>
            {statusText}
          </Badge>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-2">
            {hackathon.status !== 'ended' && (
                <Badge className={cn('font-semibold text-xs', isDdayUrgent ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300' : 'bg-background/90 text-foreground/80')}>
                {dday}
                </Badge>
            )}
             <motion.button
                whileTap={{ scale: 1.2 }}
                onClick={handleBookmarkClick}
                className="bg-background/20 dark:bg-black/20 backdrop-blur-sm rounded-full p-1.5 text-white hover:bg-background/30 dark:hover:bg-black/30 transition-colors"
                aria-label="Bookmark hackathon"
            >
                <Heart className={cn("w-5 h-5", isBookmarked && "fill-red-500 text-red-500")} />
            </motion.button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h4 className="text-lg font-semibold line-clamp-2 h-[56px] leading-snug text-card-foreground">{hackathon.title}</h4>
        
        <div className="mt-3 flex flex-wrap gap-1.5">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-1 font-normal">{tag}</Badge>
          ))}
          {hackathon.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs px-2 py-1 font-normal">+{hackathon.tags.length - 3}</Badge>
          )}
        </div>

        <div className="flex-grow" />

        <div className="mt-4 flex text-sm text-muted-foreground justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>~{formatDate(hackathon.period.endAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{hackathon.participantCount}명</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
