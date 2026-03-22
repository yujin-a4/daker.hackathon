'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useUserStore } from '@/store/useUserStore';
import HackathonListItem from '@/components/hackathon/HackathonListItem';
import HackathonFilters from '@/components/hackathon/HackathonFilters';
import RecommendedSection from '@/components/hackathon/RecommendedSection';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';

const statusMap: { [key: string]: string | undefined } = {
  '전체': undefined,
  '진행중': 'ongoing',
  '예정': 'upcoming',
  '종료': 'ended',
};

const ITEMS_PER_PAGE = 10;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function HackathonsPage() {
  const { hackathons } = useHackathonStore();
  const { currentUser } = useUserStore();

  const [statusFilter, setStatusFilter] = useState('전체');
  const [selectedType, setSelectedType] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const allTypes = useMemo(() => {
    const types = new Set<string>();
    hackathons.forEach((h) => {
      if (h.type) types.add(h.type);
    });
    return Array.from(types).sort();
  }, [hackathons]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const filteredHackathons = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return [...hackathons]
      .sort((a, b) => {
        const statusOrder = { ongoing: 0, upcoming: 1, ended: 2 };
        const statusDiff = statusOrder[a.status] - statusOrder[b.status];
        if (statusDiff !== 0) return statusDiff;
        return (
          new Date(a.period.submissionDeadlineAt).getTime() -
          new Date(b.period.submissionDeadlineAt).getTime()
        );
      })
      .filter((hackathon) => {
        const statusMatch =
          !statusMap[statusFilter] || hackathon.status === statusMap[statusFilter];
        const typeMatch =
          selectedType === '전체' || hackathon.type === selectedType;
        const searchMatch =
          !query ||
          hackathon.title.toLowerCase().includes(query) ||
          hackathon.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          (hackathon.type?.toLowerCase().includes(query) ?? false);
        const bookmarkMatch =
          !showBookmarkedOnly ||
          currentUser?.bookmarkedSlugs?.includes(hackathon.slug);
        return statusMatch && typeMatch && searchMatch && bookmarkMatch;
      });
  }, [hackathons, statusFilter, selectedType, searchQuery, showBookmarkedOnly, currentUser]);

  const totalPages = Math.ceil(filteredHackathons.length / ITEMS_PER_PAGE);
  const paginatedHackathons = filteredHackathons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleBookmarkChange = (show: boolean) => {
    setShowBookmarkedOnly(show);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setStatusFilter('전체');
    setSelectedType('전체');
    setSearchQuery('');
    setShowBookmarkedOnly(false);
    setCurrentPage(1);
  };

  // 필터가 기본 상태인지 확인
  const isDefaultFilter =
    statusFilter === '전체' &&
    selectedType === '전체' &&
    !searchQuery &&
    !showBookmarkedOnly;

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">해커톤</h1>
        <p className="mt-2 text-muted-foreground">
          다양한 해커톤에 참가하고 실력을 증명하세요.
        </p>
      </header>

      <div className="space-y-6">
        <HackathonFilters
          status={statusFilter}
          onStatusChange={handleStatusChange}
          selectedType={selectedType}
          onSelectedTypeChange={handleTypeChange}
          allTypes={allTypes}
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchChange}
          showBookmarkedOnly={showBookmarkedOnly}
          onShowBookmarkedOnlyChange={handleBookmarkChange}
        />

        {/* 추천 섹션: 필터가 기본 상태일 때만 표시 */}
        {isDefaultFilter && <RecommendedSection />}

        <div className="text-sm text-muted-foreground font-medium">
          총 {filteredHackathons.length}개
        </div>

        {paginatedHackathons.length > 0 ? (
          <>
            <motion.div
              key={currentPage}
              className="flex flex-col gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {paginatedHackathons.map((hackathon) => (
                <motion.div key={hackathon.slug} variants={itemVariants}>
                  <HackathonListItem hackathon={hackathon} />
                </motion.div>
              ))}
            </motion.div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    className="w-9"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
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
