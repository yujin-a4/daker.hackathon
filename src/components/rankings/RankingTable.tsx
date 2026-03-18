'use client';

import type { RankingUser } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Badge } from '../ui/badge';

type RankingTableProps = {
  rankings: RankingUser[];
};

const getRankIndicator = (rank: number) => {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="font-semibold text-slate-500">{rank}</span>;
};

const getRowClass = (rank: number, isCurrentUser: boolean) => {
  if (isCurrentUser) return 'bg-indigo-50/70 border-l-4 border-indigo-400';
  if (rank === 1) return 'bg-amber-50/50 border-l-4 border-amber-400';
  if (rank === 2) return 'bg-slate-100/70 border-l-4 border-slate-400';
  if (rank === 3) return 'bg-orange-100/50 border-l-4 border-orange-400';
  return 'border-l-4 border-transparent';
};

export default function RankingTable({ rankings }: RankingTableProps) {
  const { currentUser } = useUserStore();
  const isMobile = useIsMobile();
  
  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

  if (isMobile) {
    return (
      <div className="space-y-3">
        {rankings.map(user => {
          const isCurrentUser = currentUser?.nickname === user.nickname;
          return (
            <Card key={user.rank} className={cn('overflow-hidden', getRowClass(user.rank, isCurrentUser))}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-bold w-8 text-center">{getRankIndicator(user.rank)}</div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-slate-200 text-slate-600 text-sm font-semibold">
                          {getInitials(user.nickname)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="font-semibold text-slate-800">{user.nickname}</p>
                           {isCurrentUser && <Badge className="bg-indigo-100 text-indigo-700 text-xs">나</Badge>}
                        </div>
                        <p className="font-mono font-bold text-indigo-600">{user.points.toLocaleString()}pt</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t text-xs text-slate-500 grid grid-cols-2">
                    <p>참가: <span className="font-medium text-slate-700">{user.hackathonsJoined}회</span></p>
                    <p>우승: <span className="font-medium text-slate-700">{user.winsCount}회</span></p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50/50">
            <TableHead className="w-[80px]">순위</TableHead>
            <TableHead>닉네임</TableHead>
            <TableHead className="text-right">포인트</TableHead>
            <TableHead className="text-center">참가 횟수</TableHead>
            <TableHead className="text-center">우승</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankings.map(user => {
            const isCurrentUser = currentUser?.nickname === user.nickname;
            return (
              <TableRow key={user.rank} className={cn(getRowClass(user.rank, isCurrentUser), "transition-colors hover:bg-slate-50")}>
                <TableCell className="text-center font-bold">{getRankIndicator(user.rank)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                       <AvatarFallback className="bg-slate-200 text-slate-600 text-sm font-semibold">
                         {getInitials(user.nickname)}
                       </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-slate-800">{user.nickname}</span>
                    {isCurrentUser && <Badge className="bg-indigo-100 text-indigo-700 text-xs">나</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold text-indigo-600">{user.points.toLocaleString()} pt</TableCell>
                <TableCell className="text-center text-slate-600">{user.hackathonsJoined}회</TableCell>
                <TableCell className="text-center text-slate-600">
                   {user.winsCount > 0 ? (
                    <span className="flex items-center justify-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span>{user.winsCount}회</span>
                    </span>
                   ) : (
                    <span className="text-slate-400">-</span>
                   )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
