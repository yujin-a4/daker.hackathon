'use client';

import { useState } from 'react';
import { Search, X, Filter, ChevronDown, Users, CheckSquare, Square } from 'lucide-react';
import type { Hackathon } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type TeamFiltersProps = {
  hackathonFilter: string;
  setHackathonFilter: (value: string) => void;
  showOpenOnly: boolean;
  setShowOpenOnly: (value: boolean) => void;
  showPublicOnly: boolean;
  setShowPublicOnly: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  positionFilter: string;
  setPositionFilter: (value: string) => void;
  hackathons: Hackathon[];
};

const positions = [
  { label: '전체 포지션', value: 'all' },
  { label: '프론트엔드', value: 'frontend' },
  { label: '백엔드', value: 'backend' },
  { label: '디자이너', value: 'designer' },
  { label: '기획/PM', value: 'pm' },
  { label: 'AI/ML', value: 'ml' },
];

export default function TeamFilters({
  hackathonFilter,
  setHackathonFilter,
  showOpenOnly,
  setShowOpenOnly,
  showPublicOnly,
  setShowPublicOnly,
  searchQuery,
  setSearchQuery,
  positionFilter,
  setPositionFilter,
  hackathons,
}: TeamFiltersProps) {
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);

  const selectedPositionLabel =
    positions.find((position) => position.value === positionFilter)?.label ?? '필요 포지션';

  const hasActiveDetailFilters =
    showOpenOnly || showPublicOnly || positionFilter !== 'all';

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center">
        <Select value={hackathonFilter} onValueChange={setHackathonFilter}>
          <SelectTrigger className="w-full xl:w-[250px] bg-white dark:bg-slate-800">
            <SelectValue placeholder="해커톤 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 해커톤</SelectItem>
            {hackathons.map((hackathon) => (
              <SelectItem key={hackathon.slug} value={hackathon.slug}>
                {hackathon.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative w-full xl:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="팀명 또는 소개 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-9 pr-9 dark:bg-slate-800"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="검색어 지우기"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
        <Filter className="h-4 w-4 flex-shrink-0 text-slate-400" />

        <button
          type="button"
          onClick={() => setShowOpenOnly(!showOpenOnly)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
            showOpenOnly
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
          )}
        >
          {showOpenOnly ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
          모집중만 보기
        </button>

        <button
          type="button"
          onClick={() => setShowPublicOnly(!showPublicOnly)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
            showPublicOnly
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
          )}
        >
          {showPublicOnly ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
          공개팀만 보기
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setPositionDropdownOpen((prev) => !prev)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
              positionFilter !== 'all'
                ? 'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
            )}
          >
            <Users className="h-3.5 w-3.5" />
            {selectedPositionLabel}
            <ChevronDown className={cn('h-3 w-3 transition-transform', positionDropdownOpen && 'rotate-180')} />
          </button>

          {positionDropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              {positions.map((position) => (
                <button
                  key={position.value}
                  type="button"
                  onClick={() => {
                    setPositionFilter(position.value);
                    setPositionDropdownOpen(false);
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700',
                    positionFilter === position.value &&
                      'bg-purple-50 font-semibold text-primary dark:bg-purple-900/20'
                  )}
                >
                  {position.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {hasActiveDetailFilters && (
          <button
            type="button"
            onClick={() => {
              setShowOpenOnly(false);
              setShowPublicOnly(false);
              setPositionFilter('all');
              setPositionDropdownOpen(false);
            }}
            className="ml-auto text-xs font-medium text-rose-500 underline underline-offset-2 hover:text-rose-600 dark:text-rose-400"
          >
            필터 초기화
          </button>
        )}
      </div>
    </div>
  );
}
