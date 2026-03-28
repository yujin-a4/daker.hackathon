'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Users, Edit, LogOut, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
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
  const hackathon = team.hackathonSlug ? hackathons.find(h => h.slug === team.hackathonSlug) : null;
  const isMyTeam = currentUser?.teamCodes.includes(team.teamCode);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    handleActionClick(e);
    onEdit(team);
  }

  const handleCloseRecruitment = (e: React.MouseEvent) => {
    handleActionClick(e);
    updateTeam(team.teamCode, { isOpen: false });
  };
  
  return (
    <Card 
      onClick={() => onCardClick(team)}
      className={cn(
        "flex flex-col h-full rounded-xl overflow-hidden shadow-sm border bg-card transition-all duration-200 cursor-pointer",
        "hover:border-slate-300 hover:shadow-md dark:hover:border-slate-700",
        !team.isOpen && "opacity-70",
        className
      )}
    >
      <CardHeader className="p-4 pb-3">
        {matchScore !== undefined && matchScore > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-black px-3 py-1.5 rounded-lg text-sm shadow-sm border border-amber-200 dark:border-amber-500/30 flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2 duration-500">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              {matchScore}% 매칭
            </div>
          </div>
        )}
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl font-black leading-tight tracking-tight text-slate-800 dark:text-slate-100">
            {team.name}
          </CardTitle>
          <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
            {isMyTeam && <Badge variant="outline" className="border-primary/50 text-primary px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">내 팀</Badge>}
            <Badge className={cn(team.isOpen ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" : "bg-muted text-muted-foreground", "font-bold text-[10px] px-2 py-0.5 uppercase tracking-wider")}>
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
      
      <CardContent className="flex-grow flex flex-col p-4 pt-0">
        {hackathon ? (
          <Link href={`/hackathons/${hackathon.slug}`} onClick={handleActionClick} className="text-xs text-primary hover:underline flex items-center gap-1.5 mb-2 group">
            <Trophy className="w-3.5 h-3.5 text-primary/70" />
            <span className="font-medium">{hackathon.title}</span>
          </Link>
        ) : (
          <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">자유 모집 (해커톤 무관)</span>
          </div>
        )}
        
        <p className="text-xs text-secondary-foreground/80 line-clamp-3 flex-grow leading-relaxed">{team.intro}</p>

        {team.isOpen && team.lookingFor && team.lookingFor.length > 0 && (
          <div className="mt-3">
            <h5 className="text-[11px] font-semibold text-muted-foreground mb-1.5">찾는 포지션</h5>
            <TooltipProvider>
              <div className="flex flex-wrap items-center gap-1.5">
                {team.lookingFor.map(lf => (
                  <Tooltip key={lf.position}>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="bg-primary/5 text-primary/80 dark:bg-primary/10 dark:text-primary/90 text-xs font-normal px-2 py-0.5">{lf.position}</Badge>
                    </TooltipTrigger>
                    {lf.description && <TooltipContent><p>{lf.description}</p></TooltipContent>}
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        )}

        {team.progressStatus && (
          <div className="mt-4 pt-4 border-t border-dashed">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {team.progressStatus === 'planning' ? '📝 기획 중' : 
                 team.progressStatus === 'designing' ? '🎨 디자인 중' : 
                 team.progressStatus === 'developing' ? '💻 개발 중' : 
                 '🚀 배포/완료'}
              </span>
              <span className="text-[11px] font-black text-primary">{team.progressPercent || 0}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-500", team.progressPercent === 100 ? "bg-emerald-500" : "bg-primary")} 
                style={{ width: `${team.progressPercent || 0}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
           <span className="text-[10px] text-muted-foreground">{formatDate(team.createdAt).split(' ')[0]}</span>
           
           <div className="flex gap-1.5">
            {isMyTeam ? (
              <>
                <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={handleEditClick}><Edit className="w-3 h-3 mr-1" /> 수정</Button>
                {team.isOpen && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={handleActionClick}><LogOut className="w-3 h-3 mr-1" /> 모집마감</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>모집을 마감하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>더 이상 새로운 팀원을 받을 수 없게 됩니다. 이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
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
                <a href={team.contact.url} target="_blank" rel="noopener noreferrer" onClick={handleActionClick}>
                    <Button size="sm" variant="secondary" className="h-7 px-2 text-xs">
                        연락하기 <ExternalLink className="w-3 h-3 ml-1" />
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
