'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronsUpDown,
  Info,
  Medal,
  Minus,
  Search,
  Target,
  TrendingUp,
} from 'lucide-react';

import type { HackathonDetail, Leaderboard, Submission, Team, UserProfile } from '@/types';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useUserStore } from '@/store/useUserStore';
import { calculateCompetitionStandings, getHackathonPhase } from '@/lib/hackathon-utils';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type LeaderboardSectionProps = {
  leaderboard?: Leaderboard;
  hackathonDetail: HackathonDetail;
  submissions: Submission[];
};

type StageColumn = {
  key: string;
  label: string;
  shortLabel: string;
};

/** 제출 단계만 카드로 보여줄 타입 */
type SubmissionStageCard = {
  key: string;
  title: string;
  shortLabel: string;
  status: 'completed' | 'current' | 'upcoming';
  submittedCount: number;
  totalTeams: number;
  percent: number;
};

function hashSeed(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index);
  }
  return Math.abs(hash);
}

function getRankLabel(rank: number | null) {
  if (!rank) return '-';
  return `${rank}`;
}

function formatScore(value: number | null) {
  if (value === null || Number.isNaN(value)) return '-';
  return value.toFixed(1);
}

function formatDate(value?: string | null) {
  if (!value) return '미제출';
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getStageColumns(detail: HackathonDetail): StageColumn[] {
  return (detail.sections.submit.submissionItems || []).map((item, index) => ({
    key: item.key,
    label: item.title,
    shortLabel: `단계 ${index + 1}`,
  }));
}

function buildRoster(team: Team, allUsers: UserProfile[], currentUserId?: string) {
  const usersById = new Map(allUsers.map((user) => [user.id, user]));
  const leader =
    usersById.get(team.leaderId) ||
    (currentUserId === team.leaderId ? allUsers.find((user) => user.id === currentUserId) : undefined);
  const candidates = allUsers.filter((user) => user.id !== team.leaderId);
  const size = Math.max(0, (team.memberCount || 1) - 1);
  const start = candidates.length > 0 ? hashSeed(team.teamCode) % candidates.length : 0;
  const members = Array.from({ length: size })
    .map((_, index) => candidates[(start + index) % Math.max(candidates.length, 1)])
    .filter(Boolean);
  return { leader, members };
}

function SubmissionStateCell({ submittedAt }: { submittedAt?: string | null }) {
  if (!submittedAt) {
    return (
      <div className="flex items-center justify-center">
        <span className="h-5 w-5 rounded-full border border-dashed border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-900" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
              <Check className="h-3 w-3" />
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>{formatDate(submittedAt)}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function getCurrentMetricLabel(phaseType: string) {
  if (phaseType === 'RESULT') return '최종 점수';
  if (phaseType === 'JUDGING') return '심사 점수';
  if (phaseType === 'VOTING') return '투표 수';
  return '제출 진행도';
}

function getCurrentMetricValue(
  entry: {
    votes: number;
    judgeScore: number | null;
    finalScore: number | null;
    submissions: Record<string, string | null>;
  },
  phaseType: string
) {
  if (phaseType === 'RESULT') return entry.finalScore ?? null;
  if (phaseType === 'JUDGING') return entry.judgeScore ?? null;
  if (phaseType === 'VOTING') return entry.votes;
  return Object.keys(entry.submissions).length;
}

function formatMetricGap(value: number | null, phaseType: string) {
  if (value === null) return '집계 중';
  if (phaseType === 'RESULT' || phaseType === 'JUDGING') return `${value.toFixed(1)}점 차`;
  if (phaseType === 'VOTING') return `${Math.round(value).toLocaleString()}표 차`;
  return `${Math.round(value).toLocaleString()}개 차`;
}

function getRankChange(previousRank: number | null, currentRank: number | null) {
  if (!previousRank || !currentRank) {
    return { icon: ChevronsUpDown, label: '신규', color: 'text-slate-400', chip: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' };
  }
  const diff = previousRank - currentRank;
  if (diff > 0) {
    return { icon: ArrowUpRight, label: `${diff}↑`, color: 'text-emerald-500', chip: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' };
  }
  if (diff < 0) {
    return { icon: ArrowDownRight, label: `${Math.abs(diff)}↓`, color: 'text-rose-500', chip: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' };
  }
  return { icon: Minus, label: '—', color: 'text-slate-400', chip: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' };
}

export default function LeaderboardSection({ leaderboard, hackathonDetail, submissions }: LeaderboardSectionProps) {
  const { currentUser, allUsers } = useUserStore();
  const { teams } = useTeamStore();
  const { votes } = useHackathonStore();
  const [searchTerm, setSearchTerm] = useState('');

  const currentPhase = useMemo(() => getHackathonPhase(hackathonDetail), [hackathonDetail]);
  const stageColumns = useMemo(() => getStageColumns(hackathonDetail), [hackathonDetail]);
  const scheduleMilestones = hackathonDetail.sections.schedule.milestones || [];

  const hasVotingStage = useMemo(
    () => scheduleMilestones.some((m) => m.type === 'voting'),
    [scheduleMilestones]
  );
  const hasJudgeReveal = useMemo(
    () => scheduleMilestones.some((m) => m.type === 'result' || m.type === 'judging'),
    [scheduleMilestones]
  );

  const hackathonTeams = useMemo(
    () => teams.filter((team) => team.hackathonSlug === hackathonDetail.slug),
    [teams, hackathonDetail.slug]
  );

  const myTeamCode = useMemo(
    () => hackathonTeams.find((team) => currentUser?.teamCodes.includes(team.teamCode))?.teamCode,
    [hackathonTeams, currentUser]
  );

  const standings = useMemo(
    () =>
      calculateCompetitionStandings(
        currentPhase,
        hackathonTeams,
        submissions,
        votes[hackathonDetail.slug] || {},
        leaderboard?.entries || [],
        myTeamCode
      ),
    [currentPhase, hackathonTeams, submissions, votes, hackathonDetail.slug, leaderboard, myTeamCode]
  );

  const standingsWithTeams = useMemo(
    () => standings.map((entry) => ({ ...entry, team: hackathonTeams.find((t) => t.teamCode === entry.teamCode) })),
    [standings, hackathonTeams]
  );

  const filteredStandings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return standingsWithTeams;
    return standingsWithTeams.filter((entry) => {
      const leader = entry.team ? buildRoster(entry.team, allUsers, currentUser?.id).leader : undefined;
      return entry.name.toLowerCase().includes(query) || leader?.nickname.toLowerCase().includes(query);
    });
  }, [allUsers, currentUser, searchTerm, standingsWithTeams]);

  const myStanding = useMemo(() => standingsWithTeams.find((e) => e.isMyTeam), [standingsWithTeams]);

  // 제출 단계 카드만 (제출 milestone만 필터링)
  const submissionStageCards = useMemo<SubmissionStageCard[]>(() => {
    const totalTeams = Math.max(standingsWithTeams.length, 1);
    let submissionIndex = 0;

    return scheduleMilestones
      .filter((m) => m.type === 'submission')
      .map((milestone, _, arr) => {
        const idx = scheduleMilestones.indexOf(milestone);
        const itemKey = milestone.itemKey;
        const submittedCount = itemKey
          ? standingsWithTeams.filter((e) => Boolean(e.submissions[itemKey])).length
          : standingsWithTeams.filter((e) => Object.keys(e.submissions).length > 0).length;

        const status: 'completed' | 'current' | 'upcoming' =
          idx < currentPhase.milestoneIndex
            ? 'completed'
            : idx === currentPhase.milestoneIndex
              ? 'current'
              : 'upcoming';

        const card: SubmissionStageCard = {
          key: `submission-${idx}`,
          title: milestone.name,
          shortLabel: `제출 ${submissionIndex + 1}단계`,
          status,
          submittedCount,
          totalTeams,
          percent: (submittedCount / totalTeams) * 100,
        };
        submissionIndex += 1;
        return card;
      });
  }, [currentPhase.milestoneIndex, scheduleMilestones, standingsWithTeams]);

  // 전체 진행도: 제출 milestone 기준
  const totalSubmissionSteps = submissionStageCards.length;
  const completedSubmissionSteps = submissionStageCards.filter((c) => c.status === 'completed').length;
  const overallProgress = totalSubmissionSteps > 0 ? (completedSubmissionSteps / totalSubmissionSteps) * 100 : 0;

  const myPreviousRank = useMemo(() => {
    if (!myStanding) return null;
    const saved = leaderboard?.entries.find((e) => e.teamName === myStanding.name);
    return saved?.rank ?? myStanding.rank;
  }, [leaderboard, myStanding]);

  const rankChange = useMemo(
    () => getRankChange(myPreviousRank, myStanding?.rank ?? null),
    [myPreviousRank, myStanding?.rank]
  );

  const nextRankGapLabel = useMemo(() => {
    if (!myStanding?.rank) return '집계 중';
    if (myStanding.rank === 1) {
      const second = standingsWithTeams.find((e) => e.rank === 2);
      if (!second) return '선두';
      const my = getCurrentMetricValue(myStanding, currentPhase.type);
      const rival = getCurrentMetricValue(second, currentPhase.type);
      if (my === null || rival === null) return '선두';
      return `2위와 ${formatMetricGap(Math.abs(Number(my) - Number(rival)), currentPhase.type)}`;
    }
    const upper = standingsWithTeams.find((e) => e.rank === myStanding.rank! - 1);
    if (!upper) return '집계 중';
    const my = getCurrentMetricValue(myStanding, currentPhase.type);
    const up = getCurrentMetricValue(upper, currentPhase.type);
    if (my === null || up === null) return '집계 중';
    return `${upper.rank}위까지 ${formatMetricGap(Math.abs(Number(up) - Number(my)), currentPhase.type)}`;
  }, [currentPhase.type, myStanding, standingsWithTeams]);

  const isFinalized = currentPhase.type === 'RESULT';
  const RankChangeIcon = rankChange.icon;

  return (
    <div className="space-y-4">

      {/* ── 요약 카드 ── */}
      <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <CardContent className="p-5 space-y-4">
          {/* 헤더 라인 */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">진행 현황</p>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {completedSubmissionSteps}/{totalSubmissionSteps} 단계 완료
            </span>
          </div>

          {/* 전체 진행 프로그레스 바 */}
          {totalSubmissionSteps > 0 && (
            <Progress
              value={overallProgress}
              className="h-2 bg-slate-100 dark:bg-slate-800"
              indicatorClassName="bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all"
            />
          )}

          {/* 제출 단계 카드 그리드 */}
          {submissionStageCards.length > 0 && (
            <div className={cn(
              'grid gap-2',
              submissionStageCards.length === 1 && 'grid-cols-1',
              submissionStageCards.length === 2 && 'grid-cols-2',
              submissionStageCards.length >= 3 && 'grid-cols-2 sm:grid-cols-3',
            )}>
              {submissionStageCards.map((card) => (
                <div
                  key={card.key}
                  className={cn(
                    'rounded-xl border px-4 py-3 transition-colors',
                    card.status === 'current' &&
                      'border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30',
                    card.status === 'completed' &&
                      'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50',
                    card.status === 'upcoming' &&
                      'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950'
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className={cn(
                      'text-xs font-medium',
                      card.status === 'current' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'
                    )}>
                      {card.shortLabel}
                    </p>
                    <span className={cn(
                      'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                      card.status === 'current' && 'bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-300',
                      card.status === 'completed' && 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
                      card.status === 'upcoming' && 'bg-slate-50 text-slate-300 dark:bg-slate-900 dark:text-slate-600',
                    )}>
                      {card.status === 'completed' ? '완료' : card.status === 'current' ? '진행' : '예정'}
                    </span>
                  </div>
                  <p className={cn(
                    'text-xs truncate mb-2',
                    card.status === 'current' ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400 dark:text-slate-500'
                  )}>
                    {card.title}
                  </p>
                  <div className="flex items-end justify-between gap-1">
                    <span className={cn(
                      'text-lg font-bold leading-none',
                      card.status === 'current' ? 'text-violet-700 dark:text-violet-300' : 'text-slate-400 dark:text-slate-500'
                    )}>
                      {card.submittedCount}
                      <span className="text-xs font-normal ml-0.5">명</span>
                    </span>
                    <span className="text-xs text-slate-400">{Math.round(card.percent)}%</span>
                  </div>
                  <Progress
                    value={card.percent}
                    className={cn('mt-2 h-1', card.status === 'current' ? 'bg-violet-100 dark:bg-violet-950' : 'bg-slate-100 dark:bg-slate-800')}
                    indicatorClassName={cn(
                      card.status === 'current' && 'bg-violet-500',
                      card.status === 'completed' && 'bg-slate-300 dark:bg-slate-600',
                      card.status === 'upcoming' && 'bg-slate-200 dark:bg-slate-700',
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 내 순위 카드 ── */}
      {myStanding && (
        <Card className="border-violet-200/80 bg-white shadow-sm dark:border-violet-900/60 dark:bg-slate-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* 순위 숫자 */}
              <div className="relative flex-shrink-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white">
                  <span className="text-2xl font-bold leading-none">{getRankLabel(myStanding.rank)}</span>
                </div>
                <div className={cn('absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold', rankChange.chip)}>
                  <RankChangeIcon className="h-3 w-3" />
                </div>
              </div>

              {/* 팀 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge className="bg-violet-600 text-white hover:bg-violet-600 text-[11px] px-1.5 py-0 h-4">내 순위</Badge>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{myStanding.name}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  {/* 순위 변동 */}
                  <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium', rankChange.color)}>
                    <RankChangeIcon className="h-3.5 w-3.5" />
                    {rankChange.label}
                  </span>
                  {/* 다음 순위까지 차이 */}
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {nextRankGapLabel}
                  </span>
                </div>
              </div>

              {/* 현재 지표 */}
              <div className="flex-shrink-0 text-right">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{getCurrentMetricLabel(currentPhase.type)}</p>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {currentPhase.type === 'RESULT'
                    ? formatScore(myStanding.finalScore)
                    : currentPhase.type === 'VOTING'
                      ? myStanding.votes.toLocaleString()
                      : `${Object.keys(myStanding.submissions).length}/${stageColumns.length}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 리더보드 테이블 ── */}
      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Medal className="h-4 w-4 text-violet-500" />
              리더보드
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="참가자 또는 팀명 검색"
                className="pl-9 h-8 text-sm"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {/* 데스크탑 테이블 */}
          <div className="hidden overflow-x-auto lg:block">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 dark:border-slate-800">
                  <TableHead className="w-16 text-center text-xs">순위</TableHead>
                  <TableHead className="min-w-[220px] text-xs">참가자</TableHead>
                  {stageColumns.map((col) => (
                    <TableHead key={col.key} className="min-w-[80px] text-center text-xs">
                      <div className="flex flex-col items-center gap-0.5">
                        <span>{col.shortLabel}</span>
                        <span className="text-[10px] font-normal text-muted-foreground leading-tight">{col.label}</span>
                      </div>
                    </TableHead>
                  ))}
                  {hasVotingStage && <TableHead className="min-w-[70px] text-center text-xs">투표</TableHead>}
                  {hasJudgeReveal && <TableHead className="min-w-[72px] text-center text-xs">심사</TableHead>}
                  <TableHead className="min-w-[72px] text-center text-xs">최종</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStandings.map((entry) => {
                  const isMyRow = entry.isMyTeam;
                  const cellBase = cn(
                    isMyRow && 'bg-violet-50/60 dark:bg-violet-950/10'
                  );
                  const roster = !entry.isSolo && entry.team
                    ? buildRoster(entry.team, allUsers, currentUser?.id)
                    : null;
                  return (
                    <TableRow
                      key={entry.teamCode}
                      className={cn(
                        'hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors',
                        isMyRow && 'border-y border-violet-100 dark:border-violet-900/50'
                      )}
                    >
                      <TableCell className={cn(cellBase, isMyRow && 'border-l-2 border-l-violet-400', 'text-center py-3.5')}>
                        <span className={cn('font-semibold text-sm', isMyRow && 'text-violet-700 dark:text-violet-300')}>
                          {getRankLabel(entry.rank)}
                        </span>
                      </TableCell>

                      <TableCell className={cn(cellBase, 'py-3.5')}>
                        {roster ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 flex-wrap cursor-pointer w-fit group">
                                  <span className="text-sm font-medium group-hover:text-violet-600 transition-colors">{entry.name}</span>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-slate-200 text-slate-500">팀</Badge>
                                  {isMyRow && <Badge className="text-[10px] px-1.5 py-0 h-4 bg-violet-600 text-white hover:bg-violet-600">내 팀</Badge>}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="right" sideOffset={2} className="p-3 space-y-1.5 text-xs max-w-[180px]">
                                {roster.leader && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide w-8 shrink-0">팀장</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-100">{roster.leader.nickname}</span>
                                  </div>
                                )}
                                {roster.members.length > 0 && (
                                  <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                                    {roster.members.map((member) => (
                                      <div key={member.id} className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide w-8 shrink-0">팀원</span>
                                        <span className="text-slate-700 dark:text-slate-200">{member.nickname}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-medium">{entry.name}</span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-blue-200 text-blue-500">개인</Badge>
                            {isMyRow && <Badge className="text-[10px] px-1.5 py-0 h-4 bg-violet-600 text-white hover:bg-violet-600">내 팀</Badge>}
                          </div>
                        )}
                      </TableCell>

                      {stageColumns.map((col) => (
                        <TableCell key={`${entry.teamCode}-${col.key}`} className={cn(cellBase, 'text-center py-3.5')}>
                          <SubmissionStateCell submittedAt={entry.submissions[col.key]} />
                        </TableCell>
                      ))}

                      {hasVotingStage && (
                        <TableCell className={cn(cellBase, 'text-center text-sm font-medium py-3.5')}>
                          {entry.votes.toLocaleString()}
                        </TableCell>
                      )}
                      {hasJudgeReveal && (
                        <TableCell className={cn(cellBase, 'text-center text-sm font-medium py-3.5')}>
                          {formatScore(entry.judgeScore)}
                        </TableCell>
                      )}
                      <TableCell className={cn(cellBase, isMyRow && 'border-r-2 border-r-violet-400', 'text-center text-sm font-medium py-3.5')}>
                        {isFinalized ? formatScore(entry.finalScore) : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="grid gap-2 lg:hidden">
            {filteredStandings.map((entry) => (
              <div
                key={entry.teamCode}
                className={cn(
                  'rounded-xl border p-3',
                  entry.isMyTeam
                    ? 'border-violet-200 bg-violet-50/60 dark:border-violet-800 dark:bg-violet-950/10'
                    : 'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn('w-8 text-center text-lg font-bold', entry.isMyTeam && 'text-violet-600')}>
                    {getRankLabel(entry.rank)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-medium">{entry.name}</span>
                      {!entry.isSolo
                        ? <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-slate-200 text-slate-500">팀</Badge>
                        : <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-blue-200 text-blue-500">개인</Badge>
                      }
                      {entry.isMyTeam && <Badge className="text-[10px] px-1.5 py-0 h-4 bg-violet-600 text-white hover:bg-violet-600">내 팀</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {stageColumns.map((col) => (
                      <SubmissionStateCell key={col.key} submittedAt={entry.submissions[col.key]} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStandings.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-muted-foreground dark:border-slate-800">
              검색 결과가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 안내 */}
      <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs text-muted-foreground dark:border-slate-800 dark:bg-slate-900/40">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
        <p>제출 체크는 단계별 완료 여부, 투표·심사는 대회 진행에 따라 공개됩니다.</p>
      </div>
    </div>
  );
}
