'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Users, Plus, Sparkles, LayoutDashboard } from 'lucide-react';
import type { HackathonDetail, Team } from '@/types';
import { useTeamStore } from '@/store/useTeamStore';
import { useUserStore } from '@/store/useUserStore';
import { calculateMatchScore, MatchingResult } from '@/lib/matching';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/shared/EmptyState';
import TeamCard from '@/components/camp/TeamCard';
import CreateTeamModal from '@/components/camp/CreateTeamModal';
import TeamDetailModal from '@/components/camp/TeamDetailModal';

type TeamsSectionProps = {
  hackathonSlug: string;
  teamPolicy: HackathonDetail['sections']['overview']['teamPolicy'];
};

export default function TeamsSection({ hackathonSlug, teamPolicy }: TeamsSectionProps) {
  const router = useRouter();
  const { teams } = useTeamStore();
  const { currentUser } = useUserStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // 1. 내 팀 찾기
  const myTeam = useMemo(() => {
    if (!currentUser) return null;
    return teams.find(t => t.hackathonSlug === hackathonSlug && currentUser.teamCodes.includes(t.teamCode));
  }, [teams, hackathonSlug, currentUser]);

  // 2. 다른 팀들 매칭 점수로 정렬 (내 팀 제외)
  const otherTeamsWithScores = useMemo(() => {
    const others = teams.filter(t => t.hackathonSlug === hackathonSlug && t.teamCode !== myTeam?.teamCode && !t.isSolo);
    if (!currentUser) return others.map(t => ({ team: t, score: 0, matchReasons: [] }));
    
    return others
      .map(t => calculateMatchScore(currentUser, t))
      .sort((a, b) => b.score - a.score);
  }, [teams, hackathonSlug, myTeam, currentUser]);

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setIsCreateModalOpen(true);
  };

  const handleCardClick = (team: Team) => {
    setSelectedTeam(team);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 italic uppercase tracking-tight">팀 빌딩 <span className="text-primary">Status</span></h3>
          <p className="text-sm text-muted-foreground">
            {myTeam 
              ? `이미 '${myTeam.name}' 팀에 소속되어 있습니다.` 
              : "아직 소속된 팀이 없습니다. 팀을 찾거나 직접 만들어보세요!"}
          </p>
        </div>
        {!myTeam && (
          <Button onClick={() => {
            setSelectedTeam(null);
            setIsCreateModalOpen(true);
          }} className="shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> 새 팀 모집하기
          </Button>
        )}
      </div>

      {myTeam && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <LayoutDashboard className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">나의 팀 (My Team)</h2>
          </div>
          <div className="max-w-md">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-primary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative">
                <TeamCard 
                  team={myTeam} 
                  onEdit={handleEdit} 
                  onCardClick={handleCardClick}
                />
              </div>
            </div>
            <div className="mt-4">
              <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold">
                <Link href={`/basecamp/${myTeam.teamCode}`}>워크스페이스(Warroom) 입장</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {myTeam ? "다른 팀 둘러보기" : "팀 찾기"}
            </h2>
          </div>
          {!myTeam && otherTeamsWithScores.length > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md">
              <Sparkles className="w-3 h-3" /> AI 매칭순 정렬됨
            </div>
          )}
        </div>
        
        {otherTeamsWithScores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherTeamsWithScores.map((match: MatchingResult) => (
              <div key={match.team.teamCode} className="flex flex-col gap-3">
                <div className="relative">
                  {match.score > 0 && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-amber-100/90 text-amber-700 border-amber-200 backdrop-blur-sm font-black px-2 py-1 shadow-sm">
                        {match.score}% 매칭
                      </Badge>
                    </div>
                  )}
                  <TeamCard 
                    team={match.team} 
                    onEdit={handleEdit} 
                    onCardClick={handleCardClick}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="모집 중인 다른 팀이 없습니다"
            description="가장 먼저 새로운 팀을 만들어보세요!"
          />
        )}
      </section>

      <div className="bg-muted/30 rounded-2xl p-6 text-sm text-muted-foreground flex items-center gap-3">
        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">ℹ️</div>
        <span>
          이 대회는 <strong>{teamPolicy.allowSolo ? "개인 또는 팀으로" : "팀으로만"}</strong> 참가 가능하며, 
          팀 구성원은 최대 <strong>{teamPolicy.maxTeamSize}명</strong>까지 가능합니다.
        </span>
      </div>

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        editingTeam={selectedTeam}
        defaultHackathonSlug={hackathonSlug}
      />

      <TeamDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        team={selectedTeam}
        onEdit={handleEdit}
      />
    </div>
  );
}
