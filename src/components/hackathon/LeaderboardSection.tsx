'use client';

import type { HackathonDetail, Leaderboard } from '@/types';
import { formatDateTime, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { Info, ExternalLink, Medal } from 'lucide-react';
import Link from 'next/link';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/shared/EmptyState';

type LeaderboardSectionProps = {
  leaderboard: Leaderboard;
  hackathonDetail: HackathonDetail;
};

const getRankIndicator = (rank: number | null) => {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  if (rank) return rank;
  return <span className="text-slate-300">-</span>;
};

const getRowClass = (rank: number | null) => {
  if (rank === 1) return 'bg-amber-50/50 hover:bg-amber-50';
  if (rank === 2) return 'bg-slate-50/50 hover:bg-slate-50';
  if (rank === 3) return 'bg-orange-50/30 hover:bg-orange-50';
  return 'hover:bg-slate-50/50';
};

export default function LeaderboardSection({ leaderboard, hackathonDetail }: LeaderboardSectionProps) {
  if (!leaderboard || !leaderboard.entries || leaderboard.entries.length === 0) {
    return <EmptyState icon={Medal} title="아직 제출된 기록이 없습니다" description="첫 제출 팀이 되어보세요!" />;
  }

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
      <div className="text-right">
        <p className="text-sm text-slate-500">최종 갱신: {formatDateTime(leaderboard.updatedAt)}</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              {columns.map(col => (
                <TableHead key={col.key} className="text-xs text-slate-500 uppercase font-medium">
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
                    {col.key === 'teamName' && <span className="font-medium text-slate-800">{entry.teamName}</span>}
                    {col.key === 'score' && (
                      entry.score !== null ? (
                        <span className="font-mono font-semibold text-slate-800">{entry.score.toFixed(4)}</span>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-xs rounded-full px-2 font-normal">미제출</Badge>
                      )
                    )}
                    {breakdownColumns.some(b => b.key === col.key) && (
                      <span className="text-sm text-slate-600">{entry.scoreBreakdown?.[col.key] ?? '-'}</span>
                    )}
                    {col.key === 'artifacts' && entry.artifacts?.webUrl && (
                      <Link href={entry.artifacts.webUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-indigo-600 hover:underline">
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
        <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
          <span>{hackathonDetail.sections.leaderboard.note}</span>
        </div>
      )}
    </div>
  );
}
