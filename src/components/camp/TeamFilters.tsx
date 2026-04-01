'use client';

import { Search, X } from 'lucide-react';
import type { Hackathon } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type TeamFiltersProps = {
  hackathonFilter: string;
  setHackathonFilter: (value: string) => void;
  showOpenOnly: boolean;
  setShowOpenOnly: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  positionFilter: string;
  setPositionFilter: (value: string) => void;
  hackathons: Hackathon[];
};

export default function TeamFilters({
  hackathonFilter,
  setHackathonFilter,
  showOpenOnly,
  setShowOpenOnly,
  searchQuery,
  setSearchQuery,
  positionFilter,
  setPositionFilter,
  hackathons,
}: TeamFiltersProps) {
  const positions = [
    { label: '전체 포지션', value: 'all' },
    { label: '프론트엔드', value: 'frontend' },
    { label: '백엔드', value: 'backend' },
    { label: '디자인', value: 'designer' },
    { label: '기획/PM', value: 'pm' },
    { label: 'AI/ML', value: 'ml' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <Select value={hackathonFilter} onValueChange={setHackathonFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-background border-slate-200 dark:border-slate-800 focus:ring-primary/20" aria-label="해커톤 필터 선택">
              <SelectValue placeholder="해커톤 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 해커톤</SelectItem>
              {hackathons.map((h) => (
                <SelectItem key={h.slug} value={h.slug}>{h.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-3 shrink-0 bg-muted/30 px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors">
            <Checkbox 
              id="open-only" 
              checked={showOpenOnly} 
              onCheckedChange={(checked) => setShowOpenOnly(Boolean(checked))}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="open-only" className="text-sm font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              모집중만 보기
            </Label>
          </div>
        </div>

        <div className="relative w-full md:max-w-xs lg:max-w-sm shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
          <Input
            type="text"
            placeholder="팀명 또는 소개 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 h-10 shadow-sm"
            aria-label="팀명 또는 소개 검색"
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground outline-none focus:ring-1 focus:ring-primary rounded-full transition-colors"
              onClick={() => setSearchQuery('')}
              aria-label="검색어 지우기"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide" role="group" aria-label="필요 포지션 필터">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap mr-3 uppercase tracking-wider">
          필요 포지션:
        </span>
        <div className="flex items-center gap-2">
          {positions.map((pos) => (
            <Badge
              key={pos.value}
              variant={positionFilter === pos.value ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer px-4 py-2 text-[12px] whitespace-nowrap rounded-full transition-all hover:border-primary/50",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none",
                positionFilter === pos.value 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground border-slate-200 dark:border-slate-800 bg-background/50 hover:bg-muted/50"
              )}
              onClick={() => setPositionFilter(pos.value)}
              role="radio"
              aria-checked={positionFilter === pos.value}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setPositionFilter(pos.value);
                }
              }}
            >
              {pos.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
