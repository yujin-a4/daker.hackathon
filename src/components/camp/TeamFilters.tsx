'use client';

import { Search, X } from 'lucide-react';
import type { Hackathon } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type TeamFiltersProps = {
  hackathonFilter: string;
  setHackathonFilter: (value: string) => void;
  showOpenOnly: boolean;
  setShowOpenOnly: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  hackathons: Hackathon[];
};

export default function TeamFilters({
  hackathonFilter,
  setHackathonFilter,
  showOpenOnly,
  setShowOpenOnly,
  searchQuery,
  setSearchQuery,
  hackathons,
}: TeamFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
      <Select value={hackathonFilter} onValueChange={setHackathonFilter}>
        <SelectTrigger className="w-full md:w-[250px]">
          <SelectValue placeholder="해커톤 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 해커톤</SelectItem>
          {hackathons.map((h) => (
            <SelectItem key={h.slug} value={h.slug}>{h.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <Checkbox id="open-only" checked={showOpenOnly} onCheckedChange={(checked) => setShowOpenOnly(Boolean(checked))} />
        <Label htmlFor="open-only" className="text-sm font-medium text-muted-foreground cursor-pointer">모집중만 보기</Label>
      </div>
      <div className="relative flex-grow w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="팀명 또는 소개 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full"
        />
        {searchQuery && (
          <X 
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground"
            onClick={() => setSearchQuery('')}
          />
        )}
      </div>
    </div>
  );
}
