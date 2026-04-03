'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { HackathonDetail, Leaderboard, Submission } from '@/types';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { Info, Medal, TrendingUp, Search, CheckCircle2, Users, User } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { getHackathonPhase, calculateCompetitionStandings } from '@/lib/hackathon-utils';

/* ─── Types ─────────────────────────────────────── */
type LeaderboardSectionProps = {
  leaderboard: Leaderboard;
  hackathonDetail: HackathonDetail;
  status?: 'ongoing' | 'upcoming' | 'ended';
  submissions: Submission[];
};

/* ─── Rank badge ─────────────────────────────────── */
const getRankIndicator = (rank: number) => {
  if (rank === 1) return <span className="text-xl">🥇</span>;
  if (rank === 2) return <span className="text-xl">🥈</span>;
  if (rank === 3) return <span className="text-xl">🥉</span>;
  return <span className="font-bold text-slate-500">{rank}</span>;
};

/* ─── Row background ─────────────────────────────── */
const getRowClass = (rank: number | null, isMyTeam: boolean) => {
  if (isMyTeam) return 'bg-indigo-50/80 dark:bg-indigo-900/30 border-l-4 border-l-indigo-600 shadow-[inset_0_0_10px_rgba(79,70,229,0.1)]';
  if (rank === 1) return 'bg-amber-50/30 dark:bg-amber-950/10 hover:bg-amber-50';
  if (rank === 2) return 'bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50';
  if (rank === 3) return 'bg-orange-50/30 dark:bg-orange-950/10 hover:bg-orange-50';
  return 'hover:bg-muted/30';
};

/* ─── Deterministic member list ──────────────────── */
// 팀코드 해시로 항상 동일한 팀원 조합 생성
function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function getTeamMemberList(
  teamCode: string,
  leaderId: string | undefined,
  memberCount: number,
  allUsers: { id?: string; nickname: string }[]
): { nickname: string; isLeader: boolean }[] {
  const leader = leaderId ? allUsers.find(u => u.id === leaderId) : null;
  const result: { nickname: string; isLeader: boolean }[] = [];
  if (leader) result.push({ nickname: leader.nickname, isLeader: true });

  const pool = allUsers.filter(u => u.id !== leaderId);
  const needed = Math.max(0, memberCount - 1);
  const base = hashCode(teamCode);
  const chosen = new Set<number>();

  for (let i = 0; i < needed && chosen.size < pool.length; i++) {
    let idx = (base + i * 17 + i * i * 3) % pool.length;
    while (chosen.has(idx)) idx = (idx + 1) % pool.length;
    chosen.add(idx);
    result.push({ nickname: pool[idx].nickname, isLeader: false });
  }
  return result;
}

/* ─── Component ──────────────────────────────────── */
export default function LeaderboardSection({ leaderboard, hackathonDetail, submissions }: LeaderboardSectionProps) {
  const router = useRouter();
  const { currentUser, allUsers } = useUserStore();
  const { teams } = useTeamStore();
  const { votes: allVotes } = useHackathonStore();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<'all' | 'submitted'>('all');

  const currentPhase = useMemo(() => getHackathonPhase(hackathonDetail), [hackathonDetail]);
  const hackathonVotes = allVotes[hackathonDetail.slug] || {};

  const sortedEntries = useMemo(() => {
    return calculateCompetitionStandings(
      currentPhase,
      teams.filter(t => t.hackathonSlug === hackathonDetail.slug),
      submissions,
      hackathonVotes,
      leaderboard?.entries || [],
      currentUser?.teamCodes[0]
    );
  }, [currentPhase, teams, submissions, hackathonVotes, leaderboard, hackathonDetail, currentUser]);

  const filteredEntries = useMemo(() => {
    return sortedEntries.filter(entry => {
      const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'submitted' && Object.keys(entry.submissions).length > 0);
      return matchesSearch && matchesFilter;
    });
  }, [sortedEntries, searchTerm, filterType]);

  const myEntry = useMemo(() => sortedEntries.find(e => e.isMyTeam), [sortedEntries]);
  const participatingTeamsCount = sortedEntries.length;
  const submissionPhases = hackathonDetail.sections.submit.submissionItems || [];

  const phaseStats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return submissionPhases.map(phase => {
      const submissionsForPhase = submissions.filter(s => s.artifacts.some(a => a.key === phase.key));
      const deadline = phase.deadline ? new Date(phase.deadline) : null;
      const isPast = deadline ? deadline < now : false;
      const dDay = deadline ? Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

      const todayCount = submissionsForPhase.filter(s => {
        const art = s.artifacts.find(a => a.key === phase.key);
        return art && art.uploadedAt.startsWith(todayStr);
      }).length;

      return {
        ...phase,
        submittedCount: submissionsForPhase.length,
        todayCount,
        submissionRate: participatingTeamsCount > 0 ? (submissionsForPhase.length / participatingTeamsCount) * 100 : 0,
        dDay,
        isPast,
        isImminent: !isPast && dDay !== null && dDay >= 0 && dDay <= 3,
      };
    });
  }, [submissionPhases, submissions, participatingTeamsCount]);

  const activePhaseIndex = useMemo(() => {
    if (!currentPhase.itemKey) return -1;
    return submissionPhases.findIndex(p => p.key === currentPhase.itemKey);
  }, [submissionPhases, currentPhase]);

  return (
    <div className="space-y-8">

      {/* ── 대회 진행 현황 ── */}
      {submissionPhases.length > 0 && (
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-md bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                대회 진행 현황
              </CardTitle>
              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                <Badge variant="outline" className="bg-indigo-50/50 border-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                  {currentPhase.name} {currentPhase.votingEnabled ? '🗳️ 투표 중' : currentPhase.type === 'SUBMISSION' ? '📝 제출 중' : ''}
                </Badge>
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="text-indigo-600 dark:text-indigo-400">결선 진출: {participatingTeamsCount}팀</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {phaseStats.map((phase, idx) => {
                const isCurrent = activePhaseIndex === idx;
                const isPast = phase.isPast && !isCurrent;
                return (
                  <div key={phase.key} className={cn(
                    "relative p-4 rounded-xl border transition-all",
                    isCurrent ? "bg-indigo-50/40 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-500/20" : "bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800",
                    isPast && "opacity-70 grayscale-[0.2]"
                  )}>
                    {isCurrent && <Badge className="absolute -top-2.5 right-3 bg-indigo-600">진행 중</Badge>}
                    {isPast && <CheckCircle2 className="absolute -top-2.5 right-3 w-5 h-5 text-emerald-500 bg-white dark:bg-slate-900 rounded-full" />}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phase {idx + 1}</p>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{phase.title}</h4>
                      </div>
                      {phase.deadline && (
                        <Badge variant={phase.isPast ? "secondary" : phase.isImminent ? "destructive" : "outline"} className="text-[10px]">
                          {phase.isPast ? "마감됨" : phase.dDay === 0 ? "D-Day" : `D-${phase.dDay}`}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Progress value={phase.submissionRate} className="h-1.5 bg-slate-100 dark:bg-slate-800" indicatorClassName={isCurrent ? "bg-indigo-600" : "bg-slate-400"} />
                      <div className="flex justify-between text-[11px] font-medium text-slate-500">
                        <span>제출: {phase.submittedCount}팀 <span className="text-indigo-500 ml-1">(오늘 {phase.todayCount}팀)</span></span>
                        <span className={cn(isCurrent && "text-indigo-600 font-bold")}>{Math.round(phase.submissionRate)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 나의 팀 카드 ── */}
      {myEntry && (
        <Card className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white border-indigo-500/30 shadow-xl relative overflow-hidden group border-2">
          <CardContent className="p-6">
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-bold text-yellow-300">
                  {(currentPhase.type === 'RESULT' || currentPhase.type === 'VOTING' || Object.keys(myEntry.submissions).length > 0) && myEntry.rank ? getRankIndicator(myEntry.rank) : "—"}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xl font-bold text-white">{myEntry.name} <span className="text-sm font-normal text-indigo-300">(나의 팀)</span></h4>
                  </div>
                  <div className="flex items-center gap-3 text-indigo-200 text-sm font-medium">
                    {(currentPhase.type === 'RESULT' || currentPhase.type === 'VOTING' || Object.keys(myEntry.submissions).length > 0) && myEntry.rank ? (
                      <span className="text-white font-bold px-2 py-0.5 bg-indigo-500/40 rounded-md">
                        상위 {Math.max(1, Math.round((myEntry.rank / participatingTeamsCount) * 100))}%
                      </span>
                    ) : <span className="opacity-50">제출 대기 중</span>}
                    <span className="opacity-20 text-slate-700">|</span>
                    {currentPhase.type === 'RESULT' ? (
                      <span className="text-amber-300 font-bold">최종 {myEntry.finalScore?.toFixed(1)}점</span>
                    ) : currentPhase.type === 'VOTING' ? (
                      <span className="text-emerald-300 font-bold">{myEntry.votes.toLocaleString()} 투표 획득</span>
                    ) : (
                      <span>{Object.keys(myEntry.submissions).length > 0 ? `${Object.keys(myEntry.submissions).length}단계 완료` : '미제출 상태'}</span>
                    )}
                  </div>
                </div>
              </div>
              <Button onClick={() => router.push(`?tab=submit`, { scroll: false })} className="bg-white text-indigo-900 hover:bg-indigo-50 px-8 h-12 rounded-full font-bold shadow-lg">
                작품 관리하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 실시간 리더보드 테이블 ── */}
      <div className="bg-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* 헤더 */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-xl flex items-center gap-2">
              <Medal className="w-6 h-6 text-amber-500" />
              실시간 리더보드
            </h3>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-slate-400 hover:text-indigo-500 transition-colors bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/30 p-1 rounded-full">
                  <Info className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-sm ml-4 mb-2 z-50">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">MAXER 글로벌 랭킹 시스템 🏆</h4>
                  <p className="text-muted-foreground leading-relaxed">이 실시간 리더보드의 순위가 최종 확정되면 참가자의 <span className="font-bold text-black dark:text-white">글로벌 랭킹 포인트</span>에 즉시 반영됩니다.</p>
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg space-y-2 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-600 dark:text-slate-400">참여 기본 / 결과물 제출 (단계당)</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">+50 P / +100 P</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-600 dark:text-slate-400 text-[13px]">우승 (1위, 2위, 3위)</span>
                      <span className="text-amber-500 font-bold tracking-tight text-[13px]">+500, +400, +300</span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="팀명 검색" className="pl-9 h-10 rounded-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['all', 'submitted'] as const).map(type => (
                <button key={type} onClick={() => setFilterType(type)} className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all", filterType === type ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500")}>
                  {type === 'all' ? '전체' : '제출완료'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 테이블 */}
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-transparent">
              <TableHead className="w-20 text-center font-bold">순위</TableHead>
              <TableHead className="min-w-[220px] font-bold">팀/참가자</TableHead>
              {submissionPhases.map((phase, idx) => (
                <TableHead key={phase.key} className="text-center font-bold text-[10px] uppercase tracking-tighter w-16">
                  {idx + 1}단계
                </TableHead>
              ))}
              {currentPhase.type !== 'SUBMISSION' && (
                <TableHead className="text-center font-bold">실시간 득표</TableHead>
              )}
              {currentPhase.type === 'RESULT' && (
                <TableHead className="text-center font-bold">심사 점수</TableHead>
              )}
              <TableHead className="text-center font-bold">
                {currentPhase.type === 'RESULT' ? '최종 합산 점수' : '진행 상태'}
              </TableHead>
              <TableHead className="text-right font-bold pr-6">최근 업데이트</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => {
              const subCount = Object.keys(entry.submissions).length;
              const totalPhases = submissionPhases.length;

              let statusText = '대기중';
              if (subCount === totalPhases) statusText = '최종 완료';
              else if (subCount > 0) statusText = `${subCount}단계 완료`;

              // 팀원 목록 계산
              const memberList = getTeamMemberList(
                entry.teamCode,
                entry.leaderId,
                entry.memberCount ?? 1,
                allUsers ?? []
              );

              return (
                <TableRow key={entry.teamCode} className={cn(getRowClass(entry.rank, entry.isMyTeam), 'h-16 border-slate-100 dark:border-slate-800/50 transition-colors')}>
                  {/* 순위 */}
                  <TableCell className="text-center font-bold">
                    {entry.rank ? getRankIndicator(entry.rank) : <span className="text-slate-200">-</span>}
                  </TableCell>

                  {/* 팀명 + 배지 + 호버 툴팁 */}
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      {/* 제출 상태 도트 */}
                      <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", subCount > 0 ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-700")} />

                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-default">
                              {/* 팀/개인 배지 */}
                              {entry.isSolo ? (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800 shrink-0">
                                  <User className="w-2.5 h-2.5" />
                                  개인
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800 shrink-0">
                                  <Users className="w-2.5 h-2.5" />
                                  팀
                                </span>
                              )}
                              {/* 팀명 */}
                              <span className={cn(
                                "font-bold text-slate-800 dark:text-slate-100",
                                entry.isMyTeam && "text-indigo-700 dark:text-indigo-400"
                              )}>
                                {entry.name} {entry.isMyTeam && " ⭐"}
                              </span>
                            </div>
                          </TooltipTrigger>

                          {/* ── 팀원 툴팁 ── */}
                          <TooltipContent
                            side="right"
                            sideOffset={10}
                            className="p-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl bg-white dark:bg-slate-900 w-56"
                          >
                            {/* 헤더 */}
                            <div className="px-3.5 py-2.5 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/50 dark:to-indigo-950/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <p className="text-[10px] font-extrabold text-violet-700 dark:text-violet-400 uppercase tracking-widest">
                                {entry.isSolo ? '개인 참가자' : '팀 구성원'}
                              </p>
                              {!entry.isSolo && (
                                <span className="text-[9px] font-bold text-violet-500 bg-violet-100 dark:bg-violet-900/50 dark:text-violet-400 px-1.5 py-0.5 rounded-full">
                                  {memberList.length}명
                                </span>
                              )}
                            </div>
                            {/* 멤버 리스트 */}
                            <ul className="px-3 py-2.5 space-y-1.5">
                              {memberList.map((member, mIdx) => (
                                <li key={mIdx} className="flex items-center gap-2.5">
                                  {/* 아바타 */}
                                  <span className={cn(
                                    "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0",
                                    member.isLeader
                                      ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                  )}>
                                    {member.isLeader ? '👑' : mIdx}
                                  </span>
                                  {/* 닉네임 */}
                                  <span className={cn(
                                    "text-xs font-semibold flex-1",
                                    member.isLeader
                                      ? "text-slate-800 dark:text-slate-100"
                                      : "text-slate-600 dark:text-slate-400"
                                  )}>
                                    {member.nickname}
                                  </span>
                                  {/* 팀장 뱃지 */}
                                  {member.isLeader && (
                                    <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">
                                      팀장
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>

                  {/* 단계별 제출 현황 */}
                  {submissionPhases.map((phase) => (
                    <TableCell key={phase.key} className="text-center">
                      {entry.submissions[phase.key] ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-slate-200 dark:text-slate-800">—</span>
                      )}
                    </TableCell>
                  ))}

                  {/* 실시간 득표 */}
                  {currentPhase.type !== 'SUBMISSION' && (
                    <TableCell>
                      <div className="flex flex-col items-center justify-center">
                        <span className={cn("font-mono font-bold text-sm", currentPhase.type === 'VOTING' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400")}>
                          {entry.votes.toLocaleString()} <span className="text-[10px] text-muted-foreground">표</span>
                        </span>
                        {currentPhase.type === 'RESULT' && <span className="text-[9px] text-slate-400 font-bold mt-0.5">환산: {(Math.min(100, (entry.votes / 200) * 100) * 0.3).toFixed(1)}점</span>}
                      </div>
                    </TableCell>
                  )}

                  {/* 심사 점수 */}
                  {currentPhase.type === 'RESULT' && (
                    <TableCell>
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-mono font-bold text-sm text-slate-600 dark:text-slate-400">
                          {entry.judgeScore !== null ? `${entry.judgeScore}` : '—'} <span className="text-[10px] text-muted-foreground">점</span>
                        </span>
                        {entry.judgeScore !== null && <span className="text-[9px] text-slate-400 font-bold mt-0.5">환산: {(entry.judgeScore * 0.7).toFixed(1)}점</span>}
                      </div>
                    </TableCell>
                  )}

                  {/* 진행 상태 / 최종 점수 */}
                  <TableCell>
                    <div className="flex flex-col items-center justify-center">
                      {currentPhase.type === 'RESULT' ? (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800/50 flex flex-col items-center shadow-sm">
                          <span className="font-mono font-black text-indigo-700 dark:text-indigo-300">
                            {entry.finalScore !== null ? entry.finalScore.toFixed(1) + '점' : '—'}
                          </span>
                          {entry.finalScore !== null && <span className="text-[8px] text-indigo-400/80 font-bold mt-0.5 tracking-wider">TOTAL</span>}
                        </div>
                      ) : (
                        <Badge variant="outline" className={cn("text-[10px]",
                          subCount === totalPhases ? "text-emerald-600 border-emerald-200 bg-emerald-50" :
                            subCount > 0 ? "text-indigo-600 border-indigo-200 bg-indigo-50" :
                              "text-slate-400"
                        )}>
                          {statusText}
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* 최근 업데이트 */}
                  <TableCell className="text-right text-[11px] text-muted-foreground pr-6 font-medium">
                    {subCount > 0 ? formatDate(new Date(Math.max(...Object.values(entry.submissions).filter(Boolean).map(d => new Date(d as string).getTime()))).toISOString()) : '—'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filteredEntries.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">데이터가 없습니다.</div>
        )}
      </div>

      {/* 하단 안내 */}
      <div className="flex items-start gap-4 p-5 bg-amber-50/30 dark:bg-amber-900/10 border border-amber-100/50 dark:border-amber-900/30 rounded-xl text-[11px] text-slate-600 dark:text-slate-400">
        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {hackathonDetail.sections.leaderboard.note} 현재 단계에 따라 리더보드 정렬 기준(제출순 ➔ 득표순 ➔ 최종 점수순)이 자동으로 전환됩니다. 갤러리는 부정행위 방지를 위해 <strong>제출 마감 이후</strong> 공개됩니다.
        </p>
      </div>
    </div>
  );
}