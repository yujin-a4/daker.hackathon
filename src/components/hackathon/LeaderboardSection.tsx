'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { HackathonDetail, Leaderboard, Submission } from '@/types';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { 
  Info, 
  Medal, 
  TrendingUp,
  Search,
  User as UserIcon,
  Users as UsersIcon,
  CheckCircle2
} from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { 
  getHackathonPhase, 
  getLeaderboardSortingMode, 
  calculateCompetitionStandings,
  CompetitionEntry 
} from '@/lib/hackathon-utils';

type LeaderboardSectionProps = {
  leaderboard: Leaderboard;
  hackathonDetail: HackathonDetail;
  status?: 'ongoing' | 'upcoming' | 'ended';
  submissions: Submission[];
};

type UnifiedEntry = {
  teamCode: string;
  name: string;
  isSolo: boolean;
  memberCount: number;
  rank: number | null;
  score: number | null;
  votes: number;
  scoreBreakdown?: Record<string, number>;
  submittedAt: string | null;
  submission: Submission | null;
  isMyTeam: boolean;
};

const getRankIndicator = (rank: number) => {
  if (rank === 1) return <span className="text-xl">🥇</span>;
  if (rank === 2) return <span className="text-xl">🥈</span>;
  if (rank === 3) return <span className="text-xl">🥉</span>;
  return <span className="font-bold text-slate-500">{rank}</span>;
};

const getRowClass = (rank: number | null, isMyTeam: boolean) => {
  if (isMyTeam) return 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20';
  if (rank === 1) return 'bg-amber-50/30 dark:bg-amber-950/10 hover:bg-amber-50 dark:hover:bg-amber-950/20';
  if (rank === 2) return 'bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/30';
  if (rank === 3) return 'bg-orange-50/30 dark:bg-orange-950/10 hover:bg-orange-50 dark:hover:bg-orange-950/20';
  return 'hover:bg-muted/30';
};

export default function LeaderboardSection({ leaderboard, hackathonDetail, status, submissions }: LeaderboardSectionProps) {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { teams } = useTeamStore();
  const { votes: allVotes } = useHackathonStore();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<'all' | 'submitted' | 'scored'>('all');

  const currentPhase = useMemo(() => getHackathonPhase(hackathonDetail), [hackathonDetail]);
  const sortingMode = useMemo(() => getLeaderboardSortingMode(currentPhase), [currentPhase]);
  
  const hackathonVotes = allVotes[hackathonDetail.slug] || {};

  // ─── Unified Entries using Competition State Machine ───
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
        (filterType === 'submitted' && Object.keys(entry.submissions).length > 0) ||
        (filterType === 'scored' && entry.judgeScore !== null);
      return matchesSearch && matchesFilter;
    });
  }, [sortedEntries, searchTerm, filterType]);

  const myEntry = useMemo(() => sortedEntries.find(e => e.isMyTeam), [sortedEntries]);
  const participatingTeamsCount = sortedEntries.length;
  const submissionPhases = hackathonDetail.sections.submit.submissionItems || [];

  const phaseStats = useMemo(() => {
    const now = new Date();
    return submissionPhases.map(phase => {
      const submissionsForPhase = submissions.filter(s => s.artifacts.some(a => a.key === phase.key));
      const deadline = phase.deadline ? new Date(phase.deadline) : null;
      const isPast = deadline ? deadline < now : false;
      const dDay = deadline ? Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

      return {
        ...phase,
        submittedCount: submissionsForPhase.length,
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

  const maxScore = useMemo(() => {
    const scores = sortedEntries.map(e => e.judgeScore).filter((s): s is number => s !== null);
    return scores.length > 0 ? Math.max(...scores) : 0;
  }, [sortedEntries]);

  return (
    <div className="space-y-8">
      {/* ① 대회 진행 현황 대시보드 */}
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
                  <span className="w-2 h-2 rounded-full bg-indigo-500" /> 전체 참가: {participatingTeamsCount}팀
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
                         <span>제출 현황: {phase.submittedCount}팀</span>
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

      {/* ② 내 팀 현황 */}
      {myEntry && (
        <Card className="bg-slate-900 text-white border-none shadow-xl relative overflow-hidden group">
          <CardContent className="p-6">
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-bold">
                  {myEntry.rank ? getRankIndicator(myEntry.rank) : "—"}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xl font-bold">{myEntry.name} (나의 팀)</h4>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                    {myEntry.rank ? (
                      <span className="text-indigo-400 font-bold px-2 py-0.5 bg-indigo-500/10 rounded-md">상위 {Math.max(1, Math.round((myEntry.rank / participatingTeamsCount) * 100))}%</span>
                    ) : <span className="opacity-50">제출 대기 중</span>}
                    <span className="opacity-20 text-slate-700">|</span>
                    <span>{myEntry.votes.toLocaleString()} 투표</span>
                    <span className="opacity-20 text-slate-700">|</span>
                    <span>{myEntry.finalScore !== null ? `${myEntry.finalScore.toFixed(2)}점 (최종)` : myEntry.judgeScore !== null ? `${myEntry.judgeScore.toFixed(2)}점` : "진행 중"}</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => router.push(`?tab=submit`, { scroll: false })} className="bg-indigo-600 hover:bg-indigo-500 px-8 h-12 rounded-full font-bold shadow-lg">
                작품 보기/관리
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ③ 리더보드 테이블 */}
      <div className="bg-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
           <h3 className="font-extrabold text-xl flex items-center gap-2">
             <Medal className="w-6 h-6 text-amber-500" />
             실시간 리더보드
           </h3>
           <div className="flex items-center gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input placeholder="팀명 검색" className="pl-9 h-10 rounded-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
             </div>
             <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
               {(['all', 'submitted', 'scored'] as const).map(type => (
                 <button key={type} onClick={() => setFilterType(type)} className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all", filterType === type ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500")}>
                   {type === 'all' ? '전체' : type === 'submitted' ? '제출' : '심사완료'}
                 </button>
               ))}
             </div>
           </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-transparent">
              <TableHead className="w-20 text-center font-bold">순위</TableHead>
              <TableHead className="min-w-[180px] font-bold">팀/참가자</TableHead>
              {submissionPhases.map((phase, idx) => (
                <TableHead key={phase.key} className="text-center font-bold text-[10px] uppercase tracking-tighter w-16">
                  {idx + 1}단계
                </TableHead>
              ))}
              <TableHead className="text-center font-bold">득표 / 점수</TableHead>
              <TableHead className="text-right font-bold pr-6">최근 업데이트</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.teamCode} className={cn(getRowClass(entry.rank, entry.isMyTeam), 'h-16 border-slate-100 dark:border-slate-800/50')}>
                <TableCell className="text-center font-bold">
                  {entry.rank ? getRankIndicator(entry.rank) : <span className="text-slate-200">-</span>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-1.5 h-1.5 rounded-full", Object.keys(entry.submissions).length > 0 ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-700")} />
                    <span className="font-bold text-slate-800 dark:text-slate-100">{entry.name}</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 border-slate-200">{entry.isSolo ? '개인' : '팀'}</Badge>
                  </div>
                </TableCell>
                {submissionPhases.map((phase) => (
                  <TableCell key={phase.key} className="text-center">
                    {entry.submissions[phase.key] ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : (
                      <span className="text-slate-200 dark:text-slate-800">—</span>
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex flex-col items-center">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {entry.finalScore !== null 
                        ? entry.finalScore.toFixed(1) 
                        : entry.votes.toLocaleString() + '표'}
                    </span>
                    {entry.finalScore !== null && (
                      <span className="text-[9px] text-muted-foreground font-bold">WEIGHTED 30/70</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right text-[11px] text-muted-foreground pr-6 font-medium">
                   {Object.values(entry.submissions).length > 0 ? formatDate(Object.values(entry.submissions)[0]!) : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredEntries.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">데이터가 없습니다.</div>
        )}
      </div>

      {/* 안내 */}
      <div className="flex items-start gap-4 p-5 bg-amber-50/30 dark:bg-amber-900/10 border border-amber-100/50 dark:border-amber-900/30 rounded-xl text-[11px] text-slate-600 dark:text-slate-400">
        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {hackathonDetail.sections.leaderboard.note} 투표는 갤러리 탭에서 가능하며, 투표가 마감된 후 심사위원의 최종 평가가 더해져 최종 순위가 결정됩니다.
        </p>
      </div>
    </div>
  );
}
