'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import { useRankingStore } from '@/store/useRankingStore';
import RankingTable from '@/components/rankings/RankingTable';
import { Button } from '@/components/ui/button';

const timeFilterOptions = [
  { label: '전체', value: 'all' },
  { label: '최근 30일', value: '30d' },
  { label: '최근 7일', value: '7d' },
] as const;

export default function RankingsPage() {
  const { rankings, getRankingsByPeriod, recalculateRankings } = useRankingStore();
  const [activeFilter, setActiveFilter] = useState<'all' | '30d' | '7d'>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // 마운트 체크 (Hydration 오류 방지)
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 최초 진입 시 포인트 계산
  useMemo(() => {
    if (rankings.length > 0 && rankings[0].points === 0) {
      recalculateRankings();
    }
  }, [rankings, recalculateRankings]);

  const filteredRankings = useMemo(() => {
    return getRankingsByPeriod(activeFilter);
  }, [activeFilter, getRankingsByPeriod, rankings]);

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">글로벌 랭킹</h1>
        <p className="mt-2 text-muted-foreground">해커톤 참여와 성과로 쌓이는 포인트 랭킹입니다.</p>
      </header>

      <div className="flex items-center gap-2 flex-wrap mb-6">
        {timeFilterOptions.map((option) => (
          <Button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            variant={activeFilter === option.value ? 'default' : 'secondary'}
            size="sm"
          >
            {option.label}
          </Button>
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          {hasMounted ? `${filteredRankings.length}명` : '--명'}
        </span>
      </div>

      {hasMounted ? (
        <RankingTable rankings={filteredRankings} />
      ) : (
        <div className="h-96 w-full animate-pulse bg-muted/20 rounded-2xl border border-dashed flex items-center justify-center">
          <p className="text-muted-foreground">랭킹 데이터를 불러오는 중...</p>
        </div>
      )}

      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full mt-8"
      >
        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4 border">
          <h4 className="text-sm font-semibold">
            포인트 산정 기준
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2 px-4 py-3.5 border border-t-0 rounded-b-lg text-sm text-muted-foreground">
          <p>• 기본 포인트: 활동 내역에 따라 부여</p>
          <p>• 해커톤 참가: 참가 1회당 +100점</p>
          <p>• 우승: 우승 1회당 +350점</p>
          <p>• 기간 필터: 해당 기간 내 활동한 유저만 표시</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
