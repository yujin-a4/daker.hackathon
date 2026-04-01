'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, Users, ExternalLink, Edit, LogOut, Lock as LockIcon } from 'lucide-react';
import type { Team } from '@/types';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
} from "@/components/ui/alert-dialog";

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

  if (!team) return null;

  const hackathon = team.hackathonSlug ? hackathons.find(h => h.slug === team.hackathonSlug) : null;
  const isMyTeam = currentUser?.teamCodes.includes(team.teamCode);

  const handleCloseRecruitment = () => {
    updateTeam(team.teamCode, { isOpen: false });
    onOpenChange(false);
  };
  
  const handleEditClick = () => {
      onOpenChange(false); // Close detail modal
      onEdit(team); // Open edit modal
  }

  const handleHackathonLinkClick = () => {
    if(hackathon) {
        router.push(`/hackathons/${hackathon.slug}`);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{team.name}</DialogTitle>
          <DialogDescription className="sr-only">
            {team.name} 팀의 상세 정보와 모집 현황입니다.
          </DialogDescription>
          <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
            <Badge className={cn(team.isOpen ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" : "bg-muted text-muted-foreground", "font-medium")}>
              {team.isOpen ? '모집중' : '모집마감'}
            </Badge>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{team.memberCount}/{team.maxTeamSize}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {hackathon ? (
            <button onClick={handleHackathonLinkClick} className="text-sm text-primary hover:underline flex items-center gap-1.5 group">
              <Trophy className="w-4 h-4 text-primary/70" />
              <span className="font-medium">{hackathon.title}</span>
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">자유 모집 (해커톤 무관)</p>
          )}

          <div>
            <h4 className="text-sm text-muted-foreground font-medium mb-2">소개</h4>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{team.intro}</p>
          </div>

          {team.isOpen && team.lookingFor && team.lookingFor.length > 0 && (
            <div>
              <h4 className="text-sm text-muted-foreground font-medium mb-2">찾는 포지션</h4>
              <div className="space-y-2">
                {team.lookingFor.map(lf => (
                  <div key={lf.position} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                      <h5 className="font-medium text-primary">{lf.position}</h5>
                    </div>
                    {lf.description && (
                      <p className="mt-1 ml-4 text-sm text-muted-foreground">{lf.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
             <h4 className="text-sm text-muted-foreground font-medium mb-1">등록일</h4>
             <p className="text-sm text-muted-foreground">{formatDate(team.createdAt)}</p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between pt-6 border-t !mt-4">
          <div className="flex-grow flex flex-col gap-3">
            {isMyTeam ? (
              <>
                <Link href={`/basecamp/${team.teamCode}`} className="w-full" onClick={() => onOpenChange(false)}>
                  <Button className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none group transition-all">
                    <ExternalLink className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> 
                    팀 작전실 바로가기
                  </Button>
                </Link>

                <div className="flex gap-2 w-full">
                  {currentUser?.id === team.leaderId && (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 h-9 font-semibold border-slate-200" onClick={handleEditClick}>
                        <Edit className="mr-1.5 h-4 w-4" /> 정보 수정
                      </Button>
                      {team.isOpen && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex-1 h-9 font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 border border-transparent hover:border-rose-100">
                              <LogOut className="mr-1.5 h-4 w-4" /> 모집 마감
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>모집을 마감하시겠습니까?</AlertDialogTitle>
                              <AlertDialogDescription>더 이상 새로운 팀원을 받을 수 없게 됩니다. 이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction onClick={handleCloseRecruitment} className="bg-red-600 hover:bg-red-700">마감하기</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              team.isOpen ? (
                team.isPrivate ? (
                  <div className="space-y-4">
                    <p className="text-sm text-amber-700 bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800 p-3 rounded-xl flex items-start gap-2 leading-relaxed">
                      <LockIcon className="w-4 h-4 mt-0.5 shrink-0" />
                      이 팀은 <strong>초대로만 참여할 수 있는 비공개 팀</strong>입니다. 팀장의 초대를 받은 경우 알림 센터에서 수락할 수 있습니다.
                    </p>
                    <Button disabled className="w-full h-12 bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed">
                       연락하기 제한됨
                    </Button>
                  </div>
                ) : (
                  <a href={team.contact.url} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none group transition-all">
                      연락하기 (오픈카톡/DM) <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </a>
                )
              ) : (
                <p className="text-sm text-center py-4 text-muted-foreground bg-muted/30 rounded-xl">현재 모집이 마감된 팀입니다.</p>
              )
            )}
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
