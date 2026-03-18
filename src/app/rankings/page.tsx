'use client';

import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import { useRankingStore } from '@/store/useRankingStore';
import RankingTable from '@/components/rankings/RankingTable';
import { Button } from '@/components/ui/button';

const timeFilterOptions = ['전체', '최근 30일', '최근 7일'];

export default function RankingsPage() {
  const { rankings } = useRankingStore();
  const [activeFilter, setActiveFilter] = useState('전체');
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">글로벌 랭킹</h1>
        <p className="mt-2 text-slate-500">해커톤 참여와 성과로 쌓이는 포인트 랭킹입니다.</p>
      </header>

      <div className="flex items-center gap-2 flex-wrap mb-6">
        {timeFilterOptions.map((option) => (
          <Button
            key={option}
            onClick={() => setActiveFilter(option)}
            className={`rounded-lg transition-colors font-medium ${
              activeFilter === option
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            size="sm"
          >
            {option}
          </Button>
        ))}
      </div>
      
      <RankingTable rankings={rankings} />
      
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full mt-8"
      >
        <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4 border">
          <h4 className="text-sm font-semibold text-slate-700">
            포인트 산정 기준
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-3 px-4 py-3.5 bg-white border border-t-0 rounded-b-lg text-sm text-slate-600">
           <li>해커톤 참가: +100점</li>
           <li>제출 완료: +200점</li>
           <li>1위: +500점 / 2위: +350점 / 3위: +200점</li>
           <li>4~10위: +100점 / 11위~: +50점</li>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
