'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Heart, Search } from 'lucide-react';

type HackathonFiltersProps = {
  status: string;
  onStatusChange: (status: string) => void;
  selectedType: string;
  onSelectedTypeChange: (type: string) => void;
  allTypes: string[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  showBookmarkedOnly: boolean;
  onShowBookmarkedOnlyChange: (show: boolean) => void;
};

const statusOptions = ['전체', '예정', '진행중', '종료'];

export default function HackathonFilters({
  status,
  onStatusChange,
  selectedType,
  onSelectedTypeChange,
  allTypes,
  searchQuery,
  onSearchQueryChange,
  showBookmarkedOnly,
  onShowBookmarkedOnlyChange,
}: HackathonFiltersProps) {
  const hasActiveFilters =
    status !== '전체' || selectedType !== '전체' || searchQuery.length > 0 || showBookmarkedOnly;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {statusOptions.map((option) => (
            <Button
              key={option}
              onClick={() => onStatusChange(option)}
              variant={status === option ? 'default' : 'secondary'}
              size="sm"
            >
              {option}
            </Button>
          ))}
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            onClick={() => onShowBookmarkedOnlyChange(!showBookmarkedOnly)}
            variant={showBookmarkedOnly ? 'outline' : 'secondary'}
            size="sm"
            className={cn(
              showBookmarkedOnly &&
                'text-red-500 border-red-500/50 hover:bg-red-500/10 hover:text-red-500'
            )}
          >
            <Heart className="w-4 h-4 mr-1.5" />
            북마크만
          </Button>
        </div>

        <div className="relative w-56 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="제목, 태그 검색..."
            className="w-full pl-9 pr-9 py-1.5 text-sm rounded-full border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-muted-foreground mr-1">유형</span>
        {['전체', ...allTypes].map((type) => (
          <button
            key={type}
            onClick={() => onSelectedTypeChange(type)}
            className={cn(
              'px-3 py-1 text-sm rounded-full transition-all duration-200',
              selectedType === type
                ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          {status !== '전체' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
              {status}
              <button onClick={() => onStatusChange('전체')} className="hover:text-primary/70">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedType !== '전체' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
              {selectedType}
              <button onClick={() => onSelectedTypeChange('전체')} className="hover:text-primary/70">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
              &quot;{searchQuery}&quot;
              <button onClick={() => onSearchQueryChange('')} className="hover:text-primary/70">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              onStatusChange('전체');
              onSelectedTypeChange('전체');
              onSearchQueryChange('');
              onShowBookmarkedOnlyChange(false);
            }}
            className="text-muted-foreground hover:text-foreground px-0"
          >
            <X className="w-3 h-3 mr-1" />
            전체 초기화
          </Button>
        </div>
      )}
    </div>
  );
}
