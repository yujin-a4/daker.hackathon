'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { differenceInDays } from 'date-fns';
import { ArrowRight, Calendar, Heart, Users } from 'lucide-react';
import { motion } from 'framer-motion';

import type { Hackathon } from '@/types';
import { useTeamStore } from '@/store/useTeamStore';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDate, getDday, isExpired } from '@/lib/date';
import { cn, getStatusColor } from '@/lib/utils';

interface HackathonCardProps {
  hackathon: Hackathon;
}

function statusLabel(status: Hackathon['status']) {
  switch (status) {
    case 'ongoing':
      return '진행 중';
    case 'upcoming':
      return '예정';
    case 'ended':
      return '종료';
    default:
      return status;
  }
}

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { teams } = useTeamStore();
  const { currentUser, toggleBookmark } = useUserStore();
  const [progress, setProgress] = useState(0);

  const isBookmarked = currentUser?.bookmarkedSlugs?.includes(hackathon.slug);
  const participantCount = useMemo(() => {
    const matchingTeams = teams.filter((team) => team.hackathonSlug === hackathon.slug);
    if (matchingTeams.length === 0) return hackathon.participantCount;
    return matchingTeams.reduce((sum, team) => sum + (team.memberCount || 0), 0);
  }, [teams, hackathon.slug, hackathon.participantCount]);

  const daysLeft = differenceInDays(new Date(hackathon.period.endAt), new Date());
  const isUrgent = !isExpired(hackathon.period.endAt) && daysLeft <= 7;

  useEffect(() => {
    if (hackathon.status === 'ended') {
      setProgress(100);
      return;
    }
    if (hackathon.status === 'upcoming') {
      setProgress(0);
      return;
    }
    const maxDays = 30;
    const calculated = Math.max(0, Math.min(100, ((maxDays - Math.max(0, daysLeft)) / maxDays) * 100));
    setProgress(calculated);
  }, [hackathon.status, daysLeft]);

  const handleBookmarkClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleBookmark(hackathon.slug);
    toast({
      title: isBookmarked ? '북마크를 해제했습니다.' : '북마크에 추가했습니다.',
    });
  };

  return (
    <Card
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_20px_40px_-20px_rgba(99,102,241,0.15)] dark:border-white/5 dark:bg-[#0D0D0D] dark:hover:border-indigo-500/30 dark:hover:shadow-[0_0_40px_-20px_rgba(99,102,241,0.3)]"
      onClick={() => router.push(`/hackathons/${hackathon.slug}`)}
    >
      <div className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-indigo-500 to-cyan-500" />

      <div className="flex h-full flex-col gap-4 p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h4 className="line-clamp-2 text-base font-bold leading-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
              {hackathon.title}
            </h4>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBookmarkClick}
              className="flex-shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <Heart className={cn('h-4 w-4', isBookmarked ? 'fill-rose-500 text-rose-500' : 'fill-transparent')} />
            </motion.button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn('text-[10px] font-bold uppercase tracking-wider', getStatusColor(hackathon.status))}>
              {statusLabel(hackathon.status)}
            </Badge>
            <Badge variant="outline" className="bg-slate-50/50 text-[10px] font-medium text-muted-foreground dark:border-white/10 dark:bg-transparent">
              {hackathon.type}
            </Badge>
            {hackathon.status !== 'ended' && (
              <div
                className={cn(
                  'rounded border px-2 py-0.5 text-[10px] font-bold',
                  isUrgent
                    ? 'border-rose-500/20 bg-rose-500/5 text-rose-500'
                    : 'border-slate-200 bg-slate-50/50 text-muted-foreground dark:border-white/10 dark:bg-transparent'
                )}
              >
                {getDday(hackathon.period.endAt)}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              #{tag}
            </span>
          ))}
          {hackathon.tags.length > 3 && (
            <span className="text-[11px] font-bold italic text-slate-400 dark:text-slate-500/60">
              +{hackathon.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex-grow" />

        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-slate-400 dark:text-slate-500">
            <span>Progress</span>
            <span className={cn('font-black', isUrgent ? 'text-rose-500' : 'text-indigo-600 dark:text-indigo-400')}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-1000',
                hackathon.status === 'ended'
                  ? 'bg-slate-300 dark:bg-muted-foreground'
                  : isUrgent
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-500'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 font-medium dark:border-white/5">
          <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 opacity-70" />
              <span>{participantCount || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 opacity-70" />
              <span>~{formatDate(hackathon.period.endAt)}</span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-600 dark:text-slate-700 dark:group-hover:text-indigo-400" />
        </div>
      </div>
    </Card>
  );
}
