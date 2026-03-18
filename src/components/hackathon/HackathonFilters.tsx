'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Heart } from 'lucide-react';

type HackathonFiltersProps = {
  status: string;
  onStatusChange: (status: string) => void;
  selectedTags: string[];
  onSelectedTagsChange: (tags: string[]) => void;
  allTags: string[];
  showBookmarkedOnly: boolean;
  onShowBookmarkedOnlyChange: (show: boolean) => void;
};

const statusOptions = ['전체', '진행중', '예정', '종료'];

export default function HackathonFilters({ 
  status, 
  onStatusChange, 
  selectedTags, 
  onSelectedTagsChange, 
  allTags,
  showBookmarkedOnly,
  onShowBookmarkedOnlyChange
}: HackathonFiltersProps) {
  
  const handleTagClick = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onSelectedTagsChange(newTags);
  };

  return (
    <div className="space-y-4">
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
        <Button
            onClick={() => onShowBookmarkedOnlyChange(!showBookmarkedOnly)}
            variant={showBookmarkedOnly ? 'outline' : 'secondary'}
            size="sm"
            className={cn(showBookmarkedOnly && 'text-red-500 border-red-500/50 hover:bg-red-500/10 hover:text-red-500')}
        >
            <Heart className="w-4 h-4 mr-1.5" />
            <span>북마크만</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${
              selectedTags.includes(tag)
                ? 'bg-primary/10 text-primary ring-1 ring-primary/30 font-medium'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {tag}
          </button>
        ))}
        {(selectedTags.length > 0) && (
          <Button
            variant="link"
            size="sm"
            onClick={() => onSelectedTagsChange([])}
            className="text-muted-foreground hover:text-foreground px-2"
          >
            <X className="w-3 h-3 mr-1" />
            초기화
          </Button>
        )}
      </div>
    </div>
  );
}
