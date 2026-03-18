'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Plus, ChevronsRight } from 'lucide-react';
import type { HackathonDetail } from '@/types';
import { useTeamStore } from '@/store/useTeamStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmptyState from '@/components/shared/EmptyState';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type TeamsSectionProps = {
  hackathonSlug: string;
  teamPolicy: HackathonDetail['sections']['overview']['teamPolicy'];
};

export default function TeamsSection({ hackathonSlug, teamPolicy }: TeamsSectionProps) {
  const router = useRouter();
  const { teams } = useTeamStore();

  const hackathonTeams = teams.filter((team) => team.hackathonSlug === hackathonSlug);

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground">이 해커톤에서 함께 할 팀을 찾거나 만들어보세요.</p>
      
      {hackathonTeams.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {hackathonTeams.map((team) => (
            <Card key={team.teamCode} className={cn("bg-card", !team.isOpen && "opacity-60")}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                     <Badge className={cn(team.isOpen ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" : "bg-muted text-muted-foreground", "font-medium")}>
                        {team.isOpen ? '모집중' : '모집마감'}
                    </Badge>
                     <Badge variant="secondary" className="font-mono">{team.memberCount}/{team.maxTeamSize}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {team.isOpen && team.lookingFor.length > 0 && (
                   <TooltipProvider>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">찾는 포지션:</span>
                        {team.lookingFor.map(lf => (
                          <Tooltip key={lf.position}>
                            <TooltipTrigger asChild>
                              <Badge className="bg-primary/10 text-primary text-xs px-2 py-0.5">{lf.position}</Badge>
                            </TooltipTrigger>
                            {lf.description && <TooltipContent><p>{lf.description}</p></TooltipContent>}
                          </Tooltip>
                        ))}
                    </div>
                   </TooltipProvider>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2 h-[40px]">{team.intro}</p>
                {team.isOpen && (
                  <Link href={team.contact.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center group">
                    연락하기
                    <ChevronsRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="아직 등록된 팀이 없습니다"
          description="가장 먼저 팀을 만들어 멤버를 모집해보세요!"
        />
      )}

      <div className="border-t pt-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <Button 
          size="lg" 
          className="w-full md:w-auto"
          onClick={() => router.push(`/camp?hackathon=${hackathonSlug}&create=true`)}
        >
          <Plus className="mr-2 h-5 w-5" /> 새 팀 모집글 작성하기
        </Button>
        <Button 
          variant="link"
          className="text-primary"
          onClick={() => router.push(`/camp?hackathon=${hackathonSlug}`)}
        >
            캠프에서 모든 팀 보기 →
        </Button>
      </div>

       <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground flex items-center gap-2">
        <span>ℹ️</span>
        <span>
          {teamPolicy.allowSolo ? "개인 또는 팀으로" : "팀으로만"} 참가 가능하며, 최대 팀 규모는 {teamPolicy.maxTeamSize}명입니다.
        </span>
      </div>
    </div>
  );
}
