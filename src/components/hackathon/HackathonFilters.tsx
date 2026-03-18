'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type HackathonFiltersProps = {
  status: string;
  onStatusChange: (status: string) => void;
  selectedTags: string[];
  onSelectedTagsChange: (tags: string[]) => void;
  allTags: string[];
};

const statusOptions = ['전체', '진행중', '예정', '종료'];

export default function HackathonFilters({ 
  status, 
  onStatusChange, 
  selectedTags, 
  onSelectedTagsChange, 
  allTags
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
            className={`rounded-lg transition-colors font-medium ${
              status === option
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            size="sm"
          >
            {option}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${
              selectedTags.includes(tag)
                ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300 font-medium'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tag}
          </button>
        ))}
        {selectedTags.length > 0 && (
          <Button
            variant="link"
            size="sm"
            onClick={() => onSelectedTagsChange([])}
            className="text-slate-500 hover:text-slate-700 px-2"
          >
            <X className="w-3 h-3 mr-1" />
            초기화
          </Button>
        )}
      </div>
    </div>
  );
}
