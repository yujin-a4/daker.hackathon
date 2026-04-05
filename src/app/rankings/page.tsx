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
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold font-headline">글로벌 랭킹</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50">
                <Info className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 text-sm">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">MAXER 포인트 산정 기준 🏆</h4>
                <p className="text-muted-foreground leading-relaxed">MAXER 생태계에서 활동할 때마다 아래 공식을 통해 포인트가 누적되어 글로벌 랭킹과 프로필에 즉시 반영됩니다.</p>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg space-y-2 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-600 dark:text-slate-400">기본 가입 포인트</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">+100 P</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-600 dark:text-slate-400 text-[13px]">대회 결선 진출 (참여) / 산출물 제출 (건당)</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-[13px]">+50 P / +100 P</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-600 dark:text-slate-400 text-[13px]">해커톤 입상 (1위 / 2위 / 3위)</span>
                    <span className="text-amber-500 font-bold tracking-tight text-[13px]">+500 / +400 / +300 P</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-medium text-slate-600 dark:text-slate-400 text-[12px]">투표 / 팀 개설 / 멤버 합류</span>
                    <span className="text-emerald-500 font-bold tracking-tight text-[12px]">+5 / +30 / +10 P</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 leading-tight">* 실시간 리더보드의 순위 갱신 시 입상 포인트가 즉각 반영되며, 작전실 활동 및 투표 시에도 포인트가 실시간으로 누적됩니다.</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
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
        <CollapsibleContent className="space-y-2 px-4 py-4 border border-t-0 rounded-b-lg text-sm text-muted-foreground">
          <p>• <strong className="font-medium">기본 가입:</strong> +100 P</p>
          <p>• <strong className="font-medium">대회 참여 (결선 진출):</strong> +50 P</p>
          <p>• <strong className="font-medium">산출물 제출:</strong> 건당 +100 P</p>
          <p>• <strong className="font-medium">해커톤 입상:</strong> 1위 +500 P / 2위 +400 P / 3위 +300 P</p>
          <p>• <strong className="font-medium">기타 활동:</strong> 투표 +5 P / 팀 개설 +30 P / 멤버 합류 +10 P</p>
          <p className="text-xs pt-3 mt-3 border-t">* 실시간 리더보드의 순위 갱신 시 입상 포인트가 즉각 반영되며, 작전실 활동 및 투표 시에도 포인트가 실시간으로 누적됩니다.</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
