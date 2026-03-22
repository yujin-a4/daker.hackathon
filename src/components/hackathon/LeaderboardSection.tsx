'use client';

import type { HackathonDetail, Leaderboard } from '@/types';
import { formatDateTime, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { Info, ExternalLink, Medal, Trophy, PartyPopper } from 'lucide-react';
import Link from 'next/link';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/shared/EmptyState';

type LeaderboardSectionProps = {
  leaderboard: Leaderboard;
  hackathonDetail: HackathonDetail;
  status?: 'ongoing' | 'upcoming' | 'ended';
};

const getRankIndicator = (rank: number | null) => {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  if (rank) return rank;
  return <span className="text-muted-foreground/40">-</span>;
};

const getRowClass = (rank: number | null) => {
  if (rank === 1) return 'bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/30';
  if (rank === 2) return 'bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/30';
  if (rank === 3) return 'bg-orange-50/30 dark:bg-orange-950/20 hover:bg-orange-50 dark:hover:bg-orange-950/30';
  return 'hover:bg-muted/30';
};

export default function LeaderboardSection({ leaderboard, hackathonDetail, status }: LeaderboardSectionProps) {
  if (!leaderboard || !leaderboard.entries || leaderboard.entries.length === 0) {
    return <EmptyState icon={Medal} title="아직 제출된 기록이 없습니다" description="첫 제출 팀이 되어보세요!" />;
  }

  const isEnded = status === 'ended';
  const hasScores = leaderboard.entries.some(e => e.score !== null);
  const topEntries = isEnded && hasScores
    ? leaderboard.entries.filter(e => e.rank !== null && e.rank <= 3).sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
    : [];

  const hasBreakdown = !!hackathonDetail.sections.eval.scoreDisplay?.breakdown;
  const breakdownColumns = hackathonDetail.sections.eval.scoreDisplay?.breakdown || [];
  const hasArtifacts = leaderboard.entries.some(e => e.artifacts?.webUrl);

  const columns = [
    { key: 'rank', label: '순위' },
    { key: 'teamName', label: '팀명' },
    { key: 'score', label: hackathonDetail.sections.eval.metricName },
    ...(hasBreakdown ? breakdownColumns.map(b => ({ key: b.key, label: `${b.label}(${b.weightPercent}%)` })) : []),
    ...(hasArtifacts ? [{ key: 'artifacts', label: '웹링크' }] : []),
    { key: 'submittedAt', label: '제출일' },
  ];

  return (
    <div className="space-y-6">
      {/* 종료된 해커톤 결과 배너 */}
      {isEnded && hasScores && topEntries.length > 0 && (
        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/30 dark:border-amber-800/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 dark:bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-4">
              <PartyPopper className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-bold text-lg text-amber-900 dark:text-amber-200">최종 결과 발표</h3>
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 text-xs ml-1">확정</Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {topEntries.map((entry) => (
                <div
                  key={entry.teamName}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg flex-1',
                    entry.rank === 1 && 'bg-amber-100/70 dark:bg-amber-900/40',
                    entry.rank === 2 && 'bg-slate-100/70 dark:bg-slate-800/40',
                    entry.rank === 3 && 'bg-orange-100/50 dark:bg-orange-900/30',
                  )}
                >
                  <span className="text-2xl">{getRankIndicator(entry.rank)}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{entry.teamName}</p>
                    <p className="text-sm font-mono text-muted-foreground">
                      {entry.score !== null ? `${entry.score.toFixed(2)}점` : '-'}
                    </p>
                  </div>
                  {entry.rank === 1 && <Trophy className="w-5 h-5 text-amber-500 ml-auto flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 진행중 안내 배너 */}
      {status === 'ongoing' && !hasScores && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/20 p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-200">채점 진행 전</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-0.5">제출이 마감된 후 채점이 진행됩니다. 현재는 제출 현황만 표시됩니다.</p>
          </div>
        </div>
      )}

      <div className="text-right">
        <p className="text-sm text-muted-foreground">최종 갱신: {formatDateTime(leaderboard.updatedAt)}</p>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map(col => (
                <TableHead key={col.key} className="text-xs text-muted-foreground uppercase font-medium">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.entries.map((entry, index) => (
              <TableRow key={index} className={cn(getRowClass(entry.rank), 'transition-colors')}>
                {columns.map(col => (
                  <TableCell key={col.key}>
                    {col.key === 'rank' && getRankIndicator(entry.rank)}
                    {col.key === 'teamName' && <span className="font-medium">{entry.teamName}</span>}
                    {col.key === 'score' && (
                      entry.score !== null ? (
                        <span className="font-mono font-semibold">{entry.score.toFixed(4)}</span>
                      ) : (
                        <Badge variant="secondary" className="text-xs rounded-full px-2 font-normal">채점 전</Badge>
                      )
                    )}
                    {breakdownColumns.some(b => b.key === col.key) && (
                      <span className="text-sm text-muted-foreground">{entry.scoreBreakdown?.[col.key] ?? '-'}</span>
                    )}
                    {col.key === 'artifacts' && entry.artifacts?.webUrl && (
                      <Link href={entry.artifacts.webUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    {col.key === 'submittedAt' && (
                      entry.submittedAt ? formatDate(entry.submittedAt) : '-'
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hackathonDetail.sections.leaderboard.note && (
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground flex items-start gap-3">
          <Info className="w-5 h-5 text-muted-foreground/60 mt-0.5 shrink-0" />
          <span>{hackathonDetail.sections.leaderboard.note}</span>
        </div>
      )}
    </div>
  );
}
