'use client';

import type { HackathonDetail } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatKRW } from '@/lib/utils';

type PrizeSectionProps = {
  prize: HackathonDetail['sections']['prize'];
};

const getPlaceInfo = (place: string) => {
  switch (place) {
    case '1st':
      return { emoji: '🥇', rank: 1, styles: 'bg-white ring-2 ring-amber-400 md:scale-110 z-10' };
    case '2nd':
      return { emoji: '🥈', rank: 2, styles: 'bg-white ring-1 ring-slate-300' };
    case '3rd':
      return { emoji: '🥉', rank: 3, styles: 'bg-white ring-1 ring-orange-300' };
    default:
      return { emoji: '🏆', rank: 4, styles: 'bg-slate-50' };
  }
};

export default function PrizeSection({ prize }: PrizeSectionProps) {
  const sortedPrizes = [...prize.items].sort((a, b) => parseInt(a.place) - parseInt(b.place));
  const totalPrize = prize.items.reduce((sum, item) => sum + item.amountKRW, 0);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-end">
          {sortedPrizes.map((item) => {
            const { emoji, rank, styles } = getPlaceInfo(item.place);
            const isFirst = rank === 1;

            return (
              <div key={item.place} className={cn(
                'flex justify-center', 
                { 'md:order-2': rank === 1, 'md:order-1': rank === 2, 'md:order-3': rank === 3 }
              )}>
                <Card className={cn('w-full max-w-xs text-center rounded-xl shadow-sm transition-all duration-300', styles)}>
                  <CardContent className={cn('p-6', isFirst ? 'md:py-8' : 'md:py-6')}>
                    <div className="text-5xl mb-3">{emoji}</div>
                    <h4 className="text-lg font-bold text-slate-800">{item.place}</h4>
                    <p className={cn(
                      'font-bold text-indigo-600 mt-1',
                      isFirst ? 'text-3xl' : 'text-2xl'
                    )}>
                      {formatKRW(item.amountKRW)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-center mt-12">
        <p className="text-lg font-semibold text-slate-700">
          총 상금: <span className="font-bold text-indigo-600">{formatKRW(totalPrize)}</span>
        </p>
      </div>
    </div>
  );
}
