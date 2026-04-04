'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
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
import { useTeamStore } from '@/store/useTeamStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useUserStore } from '@/store/useUserStore';

import { calculateMatchScore, MatchingResult } from '@/lib/matching';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/shared/EmptyState';
import TeamCard from '@/components/camp/TeamCard';
import CreateTeamModal from '@/components/camp/CreateTeamModal';
import TeamDetailModal from '@/components/camp/TeamDetailModal';
import { cn } from '@/lib/utils';

type TeamsSectionProps = {
  hackathonSlug: string;
  teamPolicy: HackathonDetail['sections']['overview']['teamPolicy'];
};

export default function TeamsSection({ hackathonSlug, teamPolicy }: TeamsSectionProps) {
  const router = useRouter();
  const { teams } = useTeamStore();
  const { currentUser } = useUserStore();
  const notifications = useNotificationStore((state) => state.notifications);


  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // 필터 상태
  const [showOpenOnly, setShowOpenOnly] = useState(false);       // 모집중만 보기
  const [showPublicOnly, setShowPublicOnly] = useState(false);   // 공개 팀만 보기
  const [selectedPosition, setSelectedPosition] = useState('');  // 포지션 필터
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);



  // 1. 내 팀 찾기
  const myTeam = useMemo(() => {
    if (!currentUser) return null;
    return teams.find(t => t.hackathonSlug === hackathonSlug && currentUser.teamCodes.includes(t.teamCode));
  }, [teams, hackathonSlug, currentUser]);

  const searchParams = useSearchParams();

  // URL 파라미터 감지 (참가 신청 모달에서 온 요청)
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create-team' && !myTeam) {
      setSelectedTeam(null);
      setIsCreateModalOpen(true);
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('action');
      router.replace(`${window.location.pathname}?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, myTeam, router]);

  // 2. 현재 해커톤(ongoing/upcoming)의 팀만 표시 (ended 해커톤 팀 제외)
  // isSolo 팀 제외, 내 팀 제외
  const baseOtherTeams = useMemo(() => {
    return teams.filter(t =>
      t.hackathonSlug === hackathonSlug &&
      t.teamCode !== myTeam?.teamCode &&
      !t.isSolo
    );
  }, [teams, hackathonSlug, myTeam]);

  // 3. 포지션 목록 추출 (전체 팀에서 유니크)
  const availablePositions = useMemo(() => {
    const posSet = new Set<string>();
    baseOtherTeams.forEach(t => {
      t.lookingFor.forEach(lf => {
        if (lf.position) posSet.add(lf.position);
      });
    });
    return Array.from(posSet).sort();
  }, [baseOtherTeams]);

  // 4. 필터 적용 + 매칭 점수 계산
  const filteredTeamsWithScores = useMemo(() => {
    let filtered = baseOtherTeams;

    // 모집중만 보기
    if (showOpenOnly) {
      filtered = filtered.filter(t => t.isOpen);
    }

    // 공개 팀만 보기 (isPrivate: false)
    if (showPublicOnly) {
      filtered = filtered.filter(t => !t.isPrivate);
    }

    // 포지션 필터: 해당 포지션을 lookingFor에 갖고 있는 팀만
    if (selectedPosition) {
      filtered = filtered.filter(t =>
        t.lookingFor.some(lf =>
          lf.position.toLowerCase().includes(selectedPosition.toLowerCase())
        )
      );
    }

    // 매칭 점수 계산 후 정렬
    if (!currentUser) {
      return filtered.map(t => ({ team: t, score: 0, matchReasons: [] }));
    }
    return filtered
      .map(t => calculateMatchScore(currentUser, t))
      .sort((a, b) => b.score - a.score);
  }, [baseOtherTeams, showOpenOnly, showPublicOnly, selectedPosition, currentUser]);

  // 5. 상단 AI 추천 팀 (내가 속하지 않은 팀 중 이 해커톤 팀만, isSolo 제외, 최대 3개)
  // score 기준 상위 3개 (threshold 없이 — 팀이 적을 때도 추천 표시)
  const recommendedTeams = useMemo(() => {
    if (!currentUser) return [];
    return baseOtherTeams
      .filter(t => !t.isSolo)
      .map(t => calculateMatchScore(currentUser, t))
      .sort((a, b) => {
        // isOpen 팀 우선, 그 다음 점수순
        if (a.team.isOpen !== b.team.isOpen) return b.team.isOpen ? 1 : -1;
        return b.score - a.score;
      })
      .slice(0, 3);
  }, [baseOtherTeams, currentUser]);

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setIsCreateModalOpen(true);
  };

  const handleCardClick = (team: Team) => {
    setSelectedTeam(team);
    setIsDetailModalOpen(true);
  };

  const hasPendingInvitation = (teamCode: string) =>
    notifications.some(
      (notification) =>
        notification.type === 'invitation' &&
        notification.teamCode === teamCode &&
        notification.status === 'pending'
    );

  // 추천 팀 카드 렌더러
  const renderRecommendedCard = (match: MatchingResult) => (
    <button
      key={match.team.teamCode}
      onClick={() => handleCardClick(match.team)}
      className="text-left rounded-xl border bg-card p-4 hover:border-indigo-400/60 hover:shadow-md transition-all duration-200 group relative overflow-hidden"
    >
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        {/* 매칭 점수 뱃지 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              매칭 {match.score}점
            </span>
          </div>
          <div className="flex items-center gap-1">
            {match.team.isOpen ? (
              <Badge className="text-[10px] px-1.5 py-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                모집중
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                마감
              </Badge>
            )}
            {match.team.isPrivate && (
              <Lock className="w-3 h-3 text-slate-400" />
            )}
          </div>
        </div>

        {/* 팀명 */}
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5 line-clamp-1">
          {match.team.name}
        </h4>

        {/* 소개 */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{match.team.intro}</p>

        {/* 매칭 이유 */}
        {match.matchReasons.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {match.matchReasons.slice(0, 1).map((reason, i) => (
              <span
                key={i}
                className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
              >
                {reason}
              </span>
            ))}
          </div>
        )}

        {/* 모집 포지션 */}
        {match.team.lookingFor.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {match.team.lookingFor.map((lf, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {lf.position}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );

  return (
    <div className="space-y-10">
      {/* ── 상태 배너 ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 italic uppercase tracking-tight">
            팀 빌딩 <span className="text-primary">Status</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            {myTeam
              ? `이미 '${myTeam.name}' 팀에 소속되어 있습니다.`
              : '아직 소속된 팀이 없습니다. 팀을 찾거나 직접 만들어보세요!'}
          </p>
        </div>
        {!myTeam && (
          <Button
            onClick={() => {
              setSelectedTeam(null);
              setIsCreateModalOpen(true);
            }}
            className="shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" /> 새 팀 모집하기
          </Button>
        )}
      </div>

      {/* ── 나의 팀 ── */}
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
                <TeamCard team={myTeam} onEdit={handleEdit} onCardClick={handleCardClick} />
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

      {/* ── AI 추천 팀 (상단) ── */}
      {currentUser && recommendedTeams.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {currentUser.nickname}님을 위한 추천 팀
              </h2>
              <p className="text-xs text-muted-foreground">
                포지션 · 기술 스택 · 관심 분야 기반 AI 매칭
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedTeams.map(match => renderRecommendedCard(match))}
          </div>
        </section>
      )}

      {/* 로그인 안 한 경우 추천 안내 */}
      {!currentUser && (
        <div className="rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/20 p-6 text-center">
          <Sparkles className="w-7 h-7 text-indigo-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">로그인하면 AI가 최적의 팀을 추천해드립니다</p>
          <p className="text-xs text-muted-foreground">포지션, 기술 스택, 관심 분야를 분석해 나에게 딱 맞는 팀을 찾아줍니다.</p>
        </div>
      )}

      {/* ── 팀 목록 + 필터 ── */}
      <section className="space-y-5">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between px-1 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {myTeam ? '다른 팀 둘러보기' : '팀 찾기'}
            </h2>
            <span className="text-sm text-muted-foreground font-normal">
              ({filteredTeamsWithScores.length}개)
            </span>
          </div>
          {currentUser && filteredTeamsWithScores.length > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md">
              <Sparkles className="w-3 h-3" /> AI 매칭순 정렬됨
            </div>
          )}
        </div>

        {/* 필터 바 */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />

          {/* 모집중만 보기 */}
          <button
            onClick={() => setShowOpenOnly(prev => !prev)}
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all',
              showOpenOnly
                ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            )}
          >
            {showOpenOnly ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            모집중만 보기
          </button>

          {/* 공개 팀만 보기 */}
          <button
            onClick={() => setShowPublicOnly(prev => !prev)}
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all',
              showPublicOnly
                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            )}
          >
            {showPublicOnly ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            공개 팀만 보기
          </button>

          {/* 포지션 드롭다운 */}
          {availablePositions.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setPositionDropdownOpen(prev => !prev)}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all',
                  selectedPosition
                    ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                )}
              >
                <Users className="w-3.5 h-3.5" />
                {selectedPosition ? `포지션: ${selectedPosition}` : '필요 포지션'}
                <ChevronDown className={cn('w-3 h-3 transition-transform', positionDropdownOpen && 'rotate-180')} />
              </button>

              {positionDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 min-w-[160px]">
                  <button
                    onClick={() => { setSelectedPosition(''); setPositionDropdownOpen(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors',
                      !selectedPosition && 'font-semibold text-primary'
                    )}
                  >
                    전체 포지션
                  </button>
                  {availablePositions.map(pos => (
                    <button
                      key={pos}
                      onClick={() => { setSelectedPosition(pos); setPositionDropdownOpen(false); }}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors',
                        selectedPosition === pos && 'font-semibold text-primary bg-purple-50 dark:bg-purple-900/20'
                      )}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 활성 필터 초기화 */}
          {(showOpenOnly || showPublicOnly || selectedPosition) && (
            <button
              onClick={() => { setShowOpenOnly(false); setShowPublicOnly(false); setSelectedPosition(''); }}
              className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 font-medium underline underline-offset-2 ml-auto"
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* 팀 그리드 */}
        {filteredTeamsWithScores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeamsWithScores.map((match: MatchingResult) => (
              <div key={match.team.teamCode} className="flex flex-col gap-3">
                <TeamCard
                  team={match.team}
                  onEdit={handleEdit}
                  onCardClick={handleCardClick}
                  matchScore={match.score}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title={showOpenOnly || showPublicOnly || selectedPosition ? '조건에 맞는 팀이 없습니다' : '모집 중인 다른 팀이 없습니다'}
            description={
              showOpenOnly || showPublicOnly || selectedPosition
                ? '필터를 변경하거나 초기화해 보세요.'
                : '가장 먼저 새로운 팀을 만들어보세요!'
            }
          />
        )}
      </section>

      {/* 팀 정책 안내 */}
      <div className="bg-muted/30 rounded-2xl p-6 text-sm text-muted-foreground flex items-center gap-3">
        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">ℹ️</div>
        <span>
          이 대회는 <strong>{teamPolicy.allowSolo ? '개인 또는 팀으로' : '팀으로만'}</strong> 참가 가능하며,{' '}
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
