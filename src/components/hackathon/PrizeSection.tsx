'use client';

import { useMemo } from 'react';
import type { HackathonDetail } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatKRW } from '@/lib/utils';

type PrizeSectionProps = {
  prize: HackathonDetail['sections']['prize'];
};

const getPlaceInfo = (place: string) => {
  const p = place.toLowerCase();
  if (p.includes('1') || p.includes('대상') || p.includes('최우수') || p.includes('top 1') || p.includes('1st')) {
    return { emoji: '🥇', rank: 1, styles: 'bg-white border-amber-200 shadow-sm dark:bg-slate-800 dark:border-amber-700' };
  }
  if (p.includes('2') || p.includes('우수') || p.includes('2nd')) {
    return { emoji: '🥈', rank: 2, styles: 'bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700' };
  }
  if (p.includes('3') || p.includes('장려') || p.includes('3rd')) {
    return { emoji: '🥉', rank: 3, styles: 'bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700' };
  }
  return { emoji: '🏆', rank: 4, styles: 'bg-slate-50 border-dashed border-slate-200 shadow-none dark:bg-slate-900 dark:border-slate-800' };
};

export default function PrizeSection({ prize }: PrizeSectionProps) {
  const sortedPrizes = useMemo(() => {
    return [...prize.items].sort((a, b) => {
      const rankA = getPlaceInfo(a.place).rank;
      const rankB = getPlaceInfo(b.place).rank;
      return rankA - rankB;
    });
  }, [prize.items]);

  type PrizeItem = HackathonDetail['sections']['prize']['items'][number];
  const totalPrize = prize.items.reduce((sum: number, item: PrizeItem) => sum + item.amountKRW, 0);

  return (
    <div className="flex flex-col items-center py-2">
      <div className="w-full max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sortedPrizes.map((item) => {
            const { emoji, styles } = getPlaceInfo(item.place);

            return (
              <Card key={item.place} className={cn('overflow-hidden rounded-xl border transition-all duration-300', styles)}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="text-3xl shrink-0">{emoji}</div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase truncate tracking-tight">{item.place}</p>
                    <p className="text-base font-black text-slate-900 dark:text-slate-100 truncate tracking-tight">
                      {formatKRW(item.amountKRW)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
        <span>총 상금 규모:</span>
        <span className="font-bold text-slate-800 dark:text-slate-200">{formatKRW(totalPrize)}</span>
      </div>
    </div>
  );
}
