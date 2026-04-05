'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Users,
  Plus,
  Sparkles,
  LayoutDashboard,
  Zap,
  Filter,
  ChevronDown,
  Lock,
  CheckSquare,
  Square,
} from 'lucide-react';
import type { HackathonDetail, Team } from '@/types';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useUserStore } from '@/store/useUserStore';
import { calculateMatchScore, MatchingResult } from '@/lib/matching';
import { isHackathonRecruiting } from '@/lib/hackathon-utils';
import { isTeamRecruiting } from '@/lib/team-recruiting';
import { hasMatchingProfile } from '@/lib/user-profile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/shared/EmptyState';
import TeamCard from '@/components/camp/TeamCard';
import CreateTeamModal from '@/components/camp/CreateTeamModal';
import TeamDetailModal from '@/components/camp/TeamDetailModal';
import AuthModal from '@/components/auth/AuthModal';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type TeamsSectionProps = {
  hackathonSlug: string;
  teamPolicy: HackathonDetail['sections']['overview']['teamPolicy'];
};

export default function TeamsSection({ hackathonSlug, teamPolicy }: TeamsSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { teams } = useTeamStore();
  const { hackathons } = useHackathonStore();
  const { currentUser } = useUserStore();
  const { toast } = useToast();
  const notifications = useNotificationStore((state) => state.notifications);
  const canUseMatching = hasMatchingProfile(currentUser);
  const currentHackathon = useMemo(
    () => hackathons.find((hackathon) => hackathon.slug === hackathonSlug) || null,
    [hackathonSlug, hackathons]
  );
  const canRecruitInThisHackathon = currentHackathon ? isHackathonRecruiting(currentHackathon) : false;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);

  const requireAuth = useCallback(() => {
    if (currentUser) return true;

    toast({
      title: '로그인이 필요합니다.',
      description: '팀 생성은 로그인한 사용자만 가능합니다.',
      variant: 'destructive',
    });
    setIsAuthOpen(true);
    return false;
  }, [currentUser, toast]);

  const myTeam = useMemo(() => {
    if (!currentUser) return null;
    return teams.find((team) => team.hackathonSlug === hackathonSlug && currentUser.teamCodes.includes(team.teamCode)) || null;
  }, [currentUser, hackathonSlug, teams]);

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create-team' && !myTeam) {
      if (canRecruitInThisHackathon && requireAuth()) {
        setSelectedTeam(null);
        setIsCreateModalOpen(true);
      }

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('action');
      const nextQuery = newParams.toString();
      router.replace(nextQuery ? `${window.location.pathname}?${nextQuery}` : window.location.pathname, { scroll: false });
    }
  }, [canRecruitInThisHackathon, myTeam, requireAuth, router, searchParams]);

  const baseOtherTeams = useMemo(
    () =>
      teams.filter(
        (team) =>
          team.hackathonSlug === hackathonSlug &&
          team.teamCode !== myTeam?.teamCode &&
          !team.isSolo &&
          isTeamRecruiting(team, currentHackathon)
      ),
    [currentHackathon, hackathonSlug, myTeam, teams]
  );

  const availablePositions = useMemo(() => {
    const positions = new Set<string>();
    baseOtherTeams.forEach((team) => {
      team.lookingFor.forEach((item) => {
        if (item.position) positions.add(item.position);
      });
    });
    return Array.from(positions).sort();
  }, [baseOtherTeams]);

  const filteredTeamsWithScores = useMemo(() => {
    let filtered = baseOtherTeams;

    if (showOpenOnly) {
      filtered = filtered.filter((team) => isTeamRecruiting(team, currentHackathon));
    }

    if (showPublicOnly) {
      filtered = filtered.filter((team) => !team.isPrivate);
    }

    if (selectedPosition) {
      filtered = filtered.filter((team) =>
        team.lookingFor.some((item) => item.position.toLowerCase().includes(selectedPosition.toLowerCase()))
      );
    }

    if (!currentUser || !canUseMatching) {
      return filtered
        .map((team) => ({ team, score: 0, matchReasons: [] }))
        .sort(
          (a, b) =>
            Number(isTeamRecruiting(b.team, currentHackathon)) - Number(isTeamRecruiting(a.team, currentHackathon))
        );
    }

    return filtered
      .map((team) => calculateMatchScore(currentUser, team))
      .sort((a, b) => b.score - a.score);
  }, [baseOtherTeams, canUseMatching, currentHackathon, currentUser, selectedPosition, showOpenOnly, showPublicOnly]);

  const recommendedTeams = useMemo(() => {
    if (!currentUser || !canUseMatching) return [];

    return baseOtherTeams
      .map((team) => calculateMatchScore(currentUser, team))
      .sort((a, b) => {
        const aRecruiting = isTeamRecruiting(a.team, currentHackathon);
        const bRecruiting = isTeamRecruiting(b.team, currentHackathon);
        if (aRecruiting !== bRecruiting) return bRecruiting ? 1 : -1;
        return b.score - a.score;
      })
      .slice(0, 3);
  }, [baseOtherTeams, canUseMatching, currentHackathon, currentUser]);

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setIsCreateModalOpen(true);
  };

  const handleCardClick = (team: Team) => {
    setSelectedTeam(team);
    setIsDetailModalOpen(true);
  };

  const renderRecommendedCard = (match: MatchingResult) => (
    <button
      key={match.team.teamCode}
      onClick={() => handleCardClick(match.team)}
      className="group relative overflow-hidden rounded-xl border bg-card p-4 text-left transition-all duration-200 hover:border-indigo-400/60 hover:shadow-md"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 opacity-0 transition-opacity group-hover:opacity-100 dark:from-indigo-950/20 dark:to-purple-950/10" />

      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">매칭 {match.score}점</span>
          </div>
          <div className="flex items-center gap-1">
            {isTeamRecruiting(match.team, currentHackathon) ? (
              <Badge className="border-0 bg-emerald-100 px-1.5 py-0 text-[10px] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                모집중
              </Badge>
            ) : (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                마감
              </Badge>
            )}
            {match.team.isPrivate && <Lock className="h-3 w-3 text-slate-400" />}
          </div>
        </div>

        <h4 className="mb-1.5 line-clamp-1 text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
          {match.team.name}
        </h4>
        <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{match.team.intro}</p>

        {match.matchReasons.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {match.matchReasons.slice(0, 1).map((reason, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                {reason}
              </span>
            ))}
          </div>
        )}

        {match.team.lookingFor.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {match.team.lookingFor.map((item, index) => (
              <span
                key={`${item.position}-${index}`}
                className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              >
                {item.position}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50 md:flex-row md:items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100">
            팀 빌딩 <span className="text-primary">Status</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            {myTeam ? `이미 '${myTeam.name}' 팀에 소속되어 있습니다.` : '아직 소속된 팀이 없습니다. 팀을 찾거나 직접 만들어보세요.'}
          </p>
        </div>
        {!myTeam && canRecruitInThisHackathon && (
          <Button
            onClick={() => {
              if (!requireAuth()) return;
              setSelectedTeam(null);
              setIsCreateModalOpen(true);
            }}
            className="shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" /> 팀 모집하기
          </Button>
        )}
      </div>

      {myTeam && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <LayoutDashboard className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">내 팀</h2>
          </div>
          <div className="max-w-md">
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-primary opacity-20 blur transition duration-1000 group-hover:opacity-40" />
              <div className="relative">
                <TeamCard team={myTeam} onEdit={handleEdit} onCardClick={handleCardClick} />
              </div>
            </div>
            <div className="mt-4">
              <Button asChild className="w-full bg-indigo-600 font-bold hover:bg-indigo-700">
                <Link href={`/basecamp/${myTeam.teamCode}`}>워크스페이스 입장</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {currentUser && canUseMatching && canRecruitInThisHackathon && recommendedTeams.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{currentUser.nickname}님을 위한 추천 팀</h2>
              <p className="text-xs text-muted-foreground">포지션, 기술 스택, 관심 분야 기반 AI 매칭</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {recommendedTeams.map((match) => renderRecommendedCard(match))}
          </div>
        </section>
      )}

      {!currentUser && (
        <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-transparent p-6 text-center dark:border-indigo-800 dark:from-indigo-950/20">
          <Sparkles className="mx-auto mb-2 h-7 w-7 text-indigo-400" />
          <p className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">로그인하면 AI 추천 팀을 볼 수 있습니다.</p>
          <p className="text-xs text-muted-foreground">프로필을 설정하면 나와 맞는 팀을 더 정확하게 추천합니다.</p>
        </div>
      )}

      {currentUser && !canUseMatching && (
        <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-transparent p-6 text-center dark:border-indigo-800 dark:from-indigo-950/20">
          <Sparkles className="mx-auto mb-2 h-7 w-7 text-indigo-400" />
          <p className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">프로필을 설정하면 추천 팀과 매칭 점수를 볼 수 있습니다.</p>
          <p className="mb-4 text-xs text-muted-foreground">선호 유형이나 보유 스킬을 등록하면 AI 추천이 활성화됩니다.</p>
          <Button variant="outline" onClick={() => router.push('/mypage/profile')}>
            프로필 설정하기
          </Button>
        </div>
      )}

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{myTeam ? '다른 팀 둘러보기' : '팀 찾기'}</h2>
            <span className="text-sm font-normal text-muted-foreground">({filteredTeamsWithScores.length}개)</span>
          </div>
          {currentUser && canUseMatching && filteredTeamsWithScores.length > 0 && (
            <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Sparkles className="h-3 w-3" /> AI 매칭순 정렬됨
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <Filter className="h-4 w-4 flex-shrink-0 text-slate-400" />

          <button
            onClick={() => setShowOpenOnly((prev) => !prev)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
              showOpenOnly
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
            )}
          >
            {showOpenOnly ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
            모집중만 보기
          </button>

          <button
            onClick={() => setShowPublicOnly((prev) => !prev)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
              showPublicOnly
                ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
            )}
          >
            {showPublicOnly ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
            공개 팀만 보기
          </button>

          {availablePositions.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setPositionDropdownOpen((prev) => !prev)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                  selectedPosition
                    ? 'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                <Users className="h-3.5 w-3.5" />
                {selectedPosition ? `포지션 ${selectedPosition}` : '필요 포지션'}
                <ChevronDown className={cn('h-3 w-3 transition-transform', positionDropdownOpen && 'rotate-180')} />
              </button>

              {positionDropdownOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 min-w-[160px] rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <button
                    onClick={() => {
                      setSelectedPosition('');
                      setPositionDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700',
                      !selectedPosition && 'font-semibold text-primary'
                    )}
                  >
                    전체 포지션
                  </button>
                  {availablePositions.map((position) => (
                    <button
                      key={position}
                      onClick={() => {
                        setSelectedPosition(position);
                        setPositionDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700',
                        selectedPosition === position && 'bg-purple-50 font-semibold text-primary dark:bg-purple-900/20'
                      )}
                    >
                      {position}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {(showOpenOnly || showPublicOnly || selectedPosition) && (
            <button
              onClick={() => {
                setShowOpenOnly(false);
                setShowPublicOnly(false);
                setSelectedPosition('');
              }}
              className="ml-auto text-xs font-medium text-rose-500 underline underline-offset-2 hover:text-rose-600 dark:text-rose-400"
            >
              필터 초기화
            </button>
          )}
        </div>

        {filteredTeamsWithScores.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeamsWithScores.map((match) => (
              <div key={match.team.teamCode} className="flex flex-col gap-3">
                <TeamCard
                  team={match.team}
                  onEdit={handleEdit}
                  onCardClick={handleCardClick}
                  matchScore={canUseMatching ? match.score : undefined}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title={showOpenOnly || showPublicOnly || selectedPosition ? '조건에 맞는 팀이 없습니다' : '모집 중인 다른 팀이 없습니다'}
            description={showOpenOnly || showPublicOnly || selectedPosition ? '필터를 변경하거나 초기화해 보세요.' : '가장 먼저 새로운 팀을 만들어보세요.'}
          />
        )}
      </section>

      <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-6 text-sm text-muted-foreground">
        <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-slate-800">안내</div>
        <span>
          이 해커톤은 <strong>{teamPolicy.allowSolo ? '개인 또는 팀' : '팀'}</strong>으로 참가할 수 있으며 팀 인원은 최대{' '}
          <strong>{teamPolicy.maxTeamSize}명</strong>까지 가능합니다.
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

      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </div>
  );
}
