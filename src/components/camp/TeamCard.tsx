'use client';

import Link from 'next/link';
import { Trophy, Users, Edit, LogOut, MessageSquare, ExternalLink, Sparkles, Lock as LockIcon } from 'lucide-react';
import type { Team } from '@/types';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface TeamCardProps {
  team: Team;
  onEdit: (team: Team) => void;
  onCardClick: (team: Team) => void;
  className?: string;
  matchScore?: number;
}

export default function TeamCard({ team, onEdit, onCardClick, className, matchScore }: TeamCardProps) {
  const { hackathons } = useHackathonStore();
  const { currentUser } = useUserStore();
  const { updateTeam } = useTeamStore();
  const invitation = useNotificationStore((state) =>
    state.notifications.find(
      (notification) =>
        notification.type === 'invitation' &&
        notification.teamCode === team.teamCode &&
        notification.status === 'pending'
    )
  );

  const hackathon = team.hackathonSlug ? hackathons.find((item) => item.slug === team.hackathonSlug) : null;
  const isMyTeam = currentUser?.teamCodes.includes(team.teamCode);
  const hasPendingInvitation = Boolean(invitation);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    handleActionClick(e);
    onEdit(team);
  };

  const handleCloseRecruitment = (e: React.MouseEvent) => {
    handleActionClick(e);
    updateTeam(team.teamCode, { isOpen: false });
  };

  const progressLabel =
    team.progressStatus === 'planning'
      ? '아이디어 기획 중'
      : team.progressStatus === 'designing'
        ? '디자인 작업 중'
        : team.progressStatus === 'developing'
          ? '개발 진행 중'
          : '배포 및 완료';

  return (
    <Card
      onClick={() => onCardClick(team)}
      className={cn(
        'flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200',
        'hover:border-slate-300 hover:shadow-md dark:hover:border-slate-700',
        !team.isOpen && 'opacity-70',
        className
      )}
    >
      <CardHeader className="p-4 pb-3">
        {matchScore !== undefined && matchScore > 0 && (
          <div className="mb-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-100 px-3 py-1.5 text-sm font-black text-amber-700 shadow-sm animate-in fade-in slide-in-from-left-2 duration-500 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400">
              <Sparkles className="h-4 w-4 fill-amber-500/20 text-amber-500" />
              매칭 {matchScore}%
            </div>
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-black leading-tight tracking-tight text-slate-800 dark:text-slate-100">
            {team.name}
          </CardTitle>
          <div className="flex flex-shrink-0 items-center gap-1.5 pt-0.5">
            {isMyTeam && (
              <Badge variant="outline" className="border-primary/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                MY TEAM
              </Badge>
            )}
            {hasPendingInvitation && (
              <Badge className="border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                초대 도착
              </Badge>
            )}
            {team.isPrivate && (
              <Badge className="flex items-center gap-1 border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                <LockIcon className="h-2.5 w-2.5" />
                초대 전용
              </Badge>
            )}
            <Badge
              className={cn(
                team.isOpen
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                  : 'bg-muted text-muted-foreground',
                'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider'
              )}
            >
              {team.isOpen ? '모집 중' : '모집 마감'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>
              {team.memberCount}/{team.maxTeamSize}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-grow flex-col p-4 pt-0">
        {hackathon ? (
          <Link href={`/hackathons/${hackathon.slug}`} onClick={handleActionClick} className="group mb-2 flex items-center gap-1.5 text-xs text-primary hover:underline">
            <Trophy className="h-3.5 w-3.5 text-primary/70" />
            <span className="font-medium">{hackathon.title}</span>
          </Link>
        ) : (
          <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span className="font-medium">자유 모집</span>
          </div>
        )}

        <p className="line-clamp-3 flex-grow text-xs leading-relaxed text-secondary-foreground/80">{team.intro}</p>

        {team.isOpen && team.lookingFor.length > 0 && (
          <div className="mt-3">
            <h5 className="mb-1.5 text-[11px] font-semibold text-muted-foreground">찾는 포지션</h5>
            <TooltipProvider>
              <div className="flex flex-wrap items-center gap-1.5">
                {team.lookingFor.map((item) => (
                  <Tooltip key={item.position}>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className="bg-primary/5 px-2 py-0.5 text-xs font-normal text-primary/80 dark:bg-primary/10 dark:text-primary/90"
                      >
                        {item.position}
                      </Badge>
                    </TooltipTrigger>
                    {item.description && (
                      <TooltipContent>
                        <p>{item.description}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        )}

        {team.progressStatus && (
          <div className="mt-4 border-t border-dashed pt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{progressLabel}</span>
              <span className="text-[11px] font-black text-primary">{team.progressPercent || 0}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  team.progressPercent === 100 ? 'bg-emerald-500' : 'bg-primary'
                )}
                style={{ width: `${team.progressPercent || 0}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">{formatDate(team.createdAt).split(' ')[0]}</span>

          <div className="flex gap-1.5">
            {isMyTeam ? (
              <>
                <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={handleEditClick}>
                  <Edit className="mr-1 h-3 w-3" />
                  수정
                </Button>
                {team.isOpen && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={handleActionClick}>
                        <LogOut className="mr-1 h-3 w-3" />
                        모집마감
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>모집을 마감하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                          더 이상 새로운 지원자를 받을 수 없습니다. 필요하면 팀 정보를 다시 수정해 열 수 있습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleActionClick}>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCloseRecruitment}>마감하기</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </>
            ) : (
              team.isOpen && (
                <Link href={`/camp/contact/${team.teamCode}`} onClick={handleActionClick}>
                  <Button size="sm" variant="secondary" className="h-7 px-2 text-xs">
                    오픈채팅 보기
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
