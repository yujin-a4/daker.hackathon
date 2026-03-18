'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, Users, ExternalLink, Edit, LogOut } from 'lucide-react';
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
          <DialogDescription className="flex items-center gap-4 pt-1">
            <Badge className={cn(team.isOpen ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" : "bg-muted text-muted-foreground", "font-medium")}>
              {team.isOpen ? '모집중' : '모집마감'}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{team.memberCount}/{team.maxTeamSize}</span>
            </div>
          </DialogDescription>
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

        <DialogFooter className="sm:justify-between pt-4 border-t !mt-0">
          <div className="flex-grow flex items-center">
            {isMyTeam ? (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleEditClick}>
                    <Edit /> 수정하기
                </Button>
                {team.isOpen && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
                        <LogOut /> 모집마감하기
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
              </div>
            ) : (
              team.isOpen ? (
                <a href={team.contact.url} target="_blank" rel="noopener noreferrer">
                    <Button>
                        연락하기 <ExternalLink />
                    </Button>
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">현재 모집이 마감된 팀입니다.</p>
              )
            )}
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
