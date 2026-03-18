'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useHackathonStore } from '@/store/useHackathonStore';
import HackathonCard from '@/components/hackathon/HackathonCard';
import HackathonFilters from '@/components/hackathon/HackathonFilters';
import EmptyState from '@/components/shared/EmptyState';
import type { Hackathon } from '@/types';

const statusMap: { [key: string]: string | undefined } = {
  '전체': undefined,
  '진행중': 'ongoing',
  '예정': 'upcoming',
  '종료': 'ended',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function HackathonsPage() {
  const { hackathons } = useHackathonStore();
  
  const [statusFilter, setStatusFilter] = useState('전체');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    hackathons.forEach((h) => h.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [hackathons]);

  const filteredHackathons = useMemo(() => {
    return [...hackathons]
      .sort((a, b) => new Date(b.period.submissionDeadlineAt).getTime() - new Date(a.period.submissionDeadlineAt).getTime())
      .filter((hackathon) => {
        const statusMatch = !statusMap[statusFilter] || hackathon.status === statusMap[statusFilter];
        const tagsMatch = selectedTags.length === 0 || selectedTags.every((tag) => hackathon.tags.includes(tag));
        return statusMatch && tagsMatch;
    });
  }, [hackathons, statusFilter, selectedTags]);
  
  const resetFilters = () => {
    setStatusFilter('전체');
    setSelectedTags([]);
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">해커톤</h1>
        <p className="mt-2 text-slate-500">다양한 해커톤에 참가하고 실력을 증명하세요.</p>
      </header>
      
      <div className="space-y-6">
        <HackathonFilters 
          status={statusFilter}
          onStatusChange={setStatusFilter}
          selectedTags={selectedTags}
          onSelectedTagsChange={setSelectedTags}
          allTags={allTags}
        />

        <div className="text-sm text-slate-500 font-medium">
          총 {filteredHackathons.length}개
        </div>

        {filteredHackathons.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredHackathons.map((hackathon) => (
              <motion.div key={hackathon.slug} variants={itemVariants}>
                <HackathonCard hackathon={hackathon} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="pt-8">
            <EmptyState 
              icon={Search}
              title="조건에 맞는 해커톤이 없습니다"
              description="필터를 변경하거나 초기화해보세요."
              actionLabel="필터 초기화"
              onAction={resetFilters}
            />
          </div>
        )}
      </div>
    </div>
  );
}
