'use client';

import { useState } from 'react';
import type { RankingUser } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSheet from './UserProfileSheet';

type RankingTableProps = {
  rankings: RankingUser[];
};

const ITEMS_PER_PAGE = 10;

const getRankIndicator = (rank: number) => {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="font-semibold text-muted-foreground">{rank}</span>;
};

const getRowClass = (rank: number, isCurrentUser: boolean) => {
  if (isCurrentUser) return 'bg-primary/5 border-l-4 border-primary';
  return 'border-l-4 border-transparent';
};

export default function RankingTable({ rankings }: RankingTableProps) {
  const { currentUser } = useUserStore();
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<RankingUser | null>(null);

  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

  const handleUserClick = (user: RankingUser) => {
    setSelectedUser(user);
  };

  if (rankings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        해당 기간에 활동한 유저가 없습니다.
      </div>
    );
  }

  // Top 3 and others
  const top3 = rankings.slice(0, 3);
  const others = rankings.slice(3);

  const totalPages = Math.ceil(others.length / ITEMS_PER_PAGE);
  const paginatedOthers = others.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const PodiumItem = ({ user, position }: { user: RankingUser; position: number }) => {
    const isCurrentUser = currentUser?.nickname === user.nickname;
    const colors = [
      'bg-amber-400 dark:bg-amber-600',
      'bg-slate-300 dark:bg-slate-500',
      'bg-orange-400 dark:bg-orange-600'
    ];

    return (
      <div className={cn("flex flex-col items-center justify-end flex-1 max-w-[120px] md:max-w-[160px]")}>
        <div className="mb-3 text-center">
          {/* 클릭 가능한 아바타 + 닉네임 */}
          <button
            onClick={() => handleUserClick(user)}
            className={cn(
              'group flex flex-col items-center gap-2 rounded-xl p-2 transition-all',
              'hover:bg-white/20 dark:hover:bg-white/10 hover:scale-105 active:scale-100',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
            )}
            aria-label={`${user.nickname} 프로필 보기`}
          >
            <Avatar className={cn(
              "h-14 w-14 md:h-20 md:w-20 border-4 shadow-lg transition-shadow group-hover:shadow-xl",
              isCurrentUser ? "border-primary" : "border-white dark:border-slate-800"
            )}>
              <AvatarFallback className="bg-muted text-lg font-bold">
                {getInitials(user.nickname)}
              </AvatarFallback>
            </Avatar>
            <div className="mt-1">
              <p className={cn(
                "text-sm md:text-base font-bold truncate max-w-[80px] md:max-w-[120px]",
                "group-hover:text-primary transition-colors"
              )}>
                {user.nickname}
              </p>
              <p className="text-xs md:text-sm font-bold text-primary">{user.points.toLocaleString()}pt</p>
            </div>
          </button>
        </div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className={cn(
            "w-full rounded-t-xl flex flex-col items-center pt-2 md:pt-4 gap-1 shadow-inner",
            colors[position],
            position === 0 ? "h-32 md:h-44" : position === 1 ? "h-24 md:h-32" : "h-20 md:h-24"
          )}
        >
          <span className="text-2xl md:text-4xl font-black text-white/50">{position + 1}</span>
          {position === 0 && <Trophy className="w-5 h-5 md:w-8 md:h-8 text-white/80" />}
        </motion.div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-12">
        {/* Podium Section */}
        <div className="flex items-end justify-center gap-2 md:gap-8 pt-6 pb-2 px-4 bg-muted/20 rounded-3xl border border-dashed">
          {top3.length > 1 ? (
            <>
              <PodiumItem user={top3[1]} position={1} />
              <PodiumItem user={top3[0]} position={0} />
              {top3[2] && <PodiumItem user={top3[2]} position={2} />}
            </>
          ) : top3.length === 1 ? (
            <PodiumItem user={top3[0]} position={0} />
          ) : null}
        </div>

        {/* Others Table */}
        <div className="bg-card rounded-2xl border overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[80px] text-center">순위</TableHead>
                <TableHead>닉네임</TableHead>
                <TableHead className="text-right">포인트</TableHead>
                <TableHead className="text-center hidden md:table-cell">참가 횟수</TableHead>
                <TableHead className="text-center hidden md:table-cell">우승</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="wait">
                {paginatedOthers.map((user) => {
                  const isCurrentUser = currentUser?.nickname === user.nickname;
                  return (
                    <TableRow
                      key={user.nickname}
                      className={cn(
                        getRowClass(user.rank, isCurrentUser),
                        'transition-colors hover:bg-muted/30 cursor-pointer group'
                      )}
                      onClick={() => handleUserClick(user)}
                      title={`${user.nickname} 프로필 보기`}
                    >
                      <TableCell className="text-center font-bold">{getRankIndicator(user.rank)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 transition-transform group-hover:scale-110">
                            <AvatarFallback className="bg-muted text-muted-foreground text-sm font-semibold">
                              {getInitials(user.nickname)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium group-hover:text-primary transition-colors">
                            {user.nickname}
                          </span>
                          {isCurrentUser && <Badge variant="secondary" className="text-xs">나</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold text-primary">
                        {user.points.toLocaleString()} pt
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground hidden md:table-cell">{user.hackathonsJoined}회</TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        {user.winsCount > 0 ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            <span>{user.winsCount}회</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/10">
              <div className="text-sm text-muted-foreground font-medium">
                Page <span className="text-foreground">{currentPage}</span> of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = currentPage;
                    if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    if (pageNum <= 0 || pageNum > totalPages) return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0 text-xs"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 유저 프로필 카드 모달 */}
      <UserProfileSheet
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  );
}
