'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Users, Edit, LogOut, MessageSquare } from 'lucide-react';
import type { Team } from '@/types';
import { useHackathonStore } from '@/store/useHackathonStore';
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
} from "@/components/ui/alert-dialog"

interface TeamCardProps {
  team: Team;
  onEdit: (team: Team) => void;
}

export default function TeamCard({ team, onEdit }: TeamCardProps) {
  const { hackathons } = useHackathonStore();
  const { currentUser } = useUserStore();
  const { updateTeam } = useTeamStore();
  const hackathon = team.hackathonSlug ? hackathons.find(h => h.slug === team.hackathonSlug) : null;
  const isMyTeam = currentUser?.teamCodes.includes(team.teamCode);

  const handleCloseRecruitment = () => {
    updateTeam(team.teamCode, { isOpen: false });
  };
  
  return (
    <Card className={cn("flex flex-col h-full rounded-2xl overflow-hidden shadow-sm border bg-card", !team.isOpen && "opacity-70")}>
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg">{team.name}</CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isMyTeam && <Badge className="bg-primary/10 text-primary">내 팀</Badge>}
            <Badge className={cn(team.isOpen ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" : "bg-muted text-muted-foreground", "font-medium")}>
              {team.isOpen ? '모집중' : '모집마감'}
            </Badge>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground pt-1">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{team.memberCount}/{team.maxTeamSize}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col">
        {hackathon ? (
          <Link href={`/hackathons/${hackathon.slug}`} className="text-sm text-primary hover:underline flex items-center gap-1.5 mb-3 group">
            <Trophy className="w-4 h-4 text-primary/70" />
            <span className="font-medium">{hackathon.title}</span>
          </Link>
        ) : (
          <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">자유 모집 (해커톤 무관)</span>
          </div>
        )}
        
        <p className="text-sm text-secondary-foreground/80 line-clamp-3 flex-grow">{team.intro}</p>

        {team.isOpen && team.lookingFor.length > 0 && (
          <div className="mt-4">
            <h5 className="text-xs font-semibold text-muted-foreground mb-2">찾는 포지션</h5>
            <div className="flex flex-wrap items-center gap-1.5">
              {team.lookingFor.map(pos => (
                <Badge key={pos} variant="secondary" className="bg-primary/5 text-primary/80 text-xs font-normal px-2 py-0.5">{pos}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="border-t mt-4 pt-4 flex justify-between items-center">
           <span className="text-xs text-muted-foreground">{formatDate(team.createdAt)} 생성</span>
           
           <div className="flex gap-2">
            {isMyTeam ? (
              <>
                <Button size="sm" variant="outline" onClick={() => onEdit(team)}><Edit className="mr-1.5" /> 수정</Button>
                {team.isOpen && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline"><LogOut className="mr-1.5" /> 모집마감</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>모집을 마감하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>더 이상 새로운 팀원을 받을 수 없게 됩니다. 이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCloseRecruitment}>마감하기</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </>
            ) : (
              team.isOpen && (
                <a href={team.contact.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="secondary">
                        연락하기
                    </Button>
                </a>
              )
            )}
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
