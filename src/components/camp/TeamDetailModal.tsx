'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, Users, ExternalLink, Edit, LogOut, Lock as LockIcon } from 'lucide-react';
import type { Team } from '@/types';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface TeamDetailModalProps {
  team: Team | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEdit: (team: Team) => void;
}

export default function TeamDetailModal({ team, isOpen, onOpenChange, onEdit }: TeamDetailModalProps) {
  const router = useRouter();
  const { hackathons } = useHackathonStore();
  const { currentUser } = useUserStore();
  const { updateTeam } = useTeamStore();
  const invitation = useNotificationStore((state) =>
    team
      ? state.notifications.find(
          (notification) =>
            notification.type === 'invitation' &&
            notification.teamCode === team.teamCode &&
            notification.status === 'pending'
        )
      : undefined
  );

  if (!team) return null;

  const hackathon = team.hackathonSlug ? hackathons.find((item) => item.slug === team.hackathonSlug) : null;
  const isMyTeam = currentUser?.teamCodes.includes(team.teamCode);
  const hasPendingInvitation = Boolean(invitation);

  const handleCloseRecruitment = () => {
    updateTeam(team.teamCode, { isOpen: false });
    onOpenChange(false);
  };

  const handleEditClick = () => {
    onOpenChange(false);
    onEdit(team);
  };

  const handleHackathonLinkClick = () => {
    if (hackathon) {
      router.push(`/hackathons/${hackathon.slug}`);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{team.name}</DialogTitle>
          <DialogDescription className="sr-only">{team.name} 팀의 상세 정보와 모집 현황입니다.</DialogDescription>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-sm text-muted-foreground">
            {hasPendingInvitation && (
              <Badge className="border-indigo-100 bg-indigo-50 font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                이 팀이 나를 초대했어요
              </Badge>
            )}
            <Badge
              className={cn(
                team.isOpen
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                  : 'bg-muted text-muted-foreground',
                'font-medium'
              )}
            >
              {team.isOpen ? '모집 중' : '모집 마감'}
            </Badge>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>
                {team.memberCount}/{team.maxTeamSize}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-6 overflow-y-auto py-4 pr-2">
          {hasPendingInvitation && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 p-4 dark:border-indigo-800 dark:bg-indigo-950/30">
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">이 팀에서 합류 초대를 보냈습니다.</p>
              <p className="mt-1 text-sm text-indigo-700/80 dark:text-indigo-300/80">
                알림 센터에서 팀 정보를 확인한 뒤 수락하거나 거절할 수 있습니다.
              </p>
            </div>
          )}

          {hackathon ? (
            <button onClick={handleHackathonLinkClick} className="group flex items-center gap-1.5 text-sm text-primary hover:underline">
              <Trophy className="h-4 w-4 text-primary/70" />
              <span className="font-medium">{hackathon.title}</span>
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">자유 모집</p>
          )}

          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">소개</h4>
            <p className="whitespace-pre-wrap leading-relaxed text-foreground/80">{team.intro}</p>
          </div>

          {team.isOpen && team.lookingFor.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">찾는 포지션</h4>
              <div className="space-y-2">
                {team.lookingFor.map((item) => (
                  <div key={item.position} className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary/50" />
                      <h5 className="font-medium text-primary">{item.position}</h5>
                    </div>
                    {item.description && <p className="ml-4 mt-1 text-sm text-muted-foreground">{item.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="mb-1 text-sm font-medium text-muted-foreground">등록일</h4>
            <p className="text-sm text-muted-foreground">{formatDate(team.createdAt)}</p>
          </div>
        </div>

        <DialogFooter className="!mt-4 border-t pt-6 sm:justify-between">
          <div className="flex flex-grow flex-col gap-3">
            {isMyTeam ? (
              <>
                <Link href={`/basecamp/${team.teamCode}`} className="w-full" onClick={() => onOpenChange(false)}>
                  <Button className="group h-12 w-full bg-indigo-600 text-base font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 dark:shadow-none">
                    <ExternalLink className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    팀 워룸 바로가기
                  </Button>
                </Link>

                <div className="flex w-full gap-2">
                  {currentUser?.id === team.leaderId && (
                    <>
                      <Button variant="outline" size="sm" className="h-9 flex-1 font-semibold border-slate-200" onClick={handleEditClick}>
                        <Edit className="mr-1.5 h-4 w-4" />
                        정보 수정
                      </Button>
                      {team.isOpen && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 flex-1 border border-transparent font-semibold text-rose-600 hover:border-rose-100 hover:bg-rose-50 hover:text-rose-700"
                            >
                              <LogOut className="mr-1.5 h-4 w-4" />
                              모집 마감
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>모집을 마감하시겠습니까?</AlertDialogTitle>
                              <AlertDialogDescription>
                                더 이상 새로운 지원자를 받을 수 없습니다. 필요하면 팀 정보를 수정해 다시 열 수 있습니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction onClick={handleCloseRecruitment} className="bg-red-600 hover:bg-red-700">
                                마감하기
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : team.isOpen ? (
              team.isPrivate ? (
                <div className="space-y-4">
                  <p className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm leading-relaxed text-amber-700 dark:border-amber-800 dark:bg-amber-900/30">
                    <LockIcon className="mt-0.5 h-4 w-4 shrink-0" />
                    이 팀은 <strong>초대로만 참여할 수 있는 비공개 팀</strong>입니다. 팀장의 초대를 받은 경우 알림 센터에서 수락할 수 있습니다.
                  </p>
                  <Button disabled className="h-12 w-full cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800">
                    연락하기 제한됨
                  </Button>
                </div>
              ) : (
                <Link href={`/camp/contact/${team.teamCode}`}>
                  <Button className="group h-12 w-full bg-indigo-600 text-base font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 dark:shadow-none">
                    연락하기 (오픈채팅 데모)
                    <ExternalLink className="ml-2 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Button>
                </Link>
              )
            ) : (
              <p className="rounded-xl bg-muted/30 py-4 text-center text-sm text-muted-foreground">현재 모집이 마감된 팀입니다.</p>
            )}
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
