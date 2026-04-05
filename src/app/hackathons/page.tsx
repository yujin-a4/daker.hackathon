'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useUserStore } from '@/store/useUserStore';
import HackathonCard from '@/components/hackathon/HackathonCard';
import HackathonFilters from '@/components/hackathon/HackathonFilters';
import RecommendedSection from '@/components/hackathon/RecommendedSection';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';

const statusMap: { [key: string]: string | undefined } = {
  전체: undefined,
  모집중: 'recruiting',
  진행중: 'ongoing',
  종료: 'ended',
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
  const [sortOption, setSortOption] = useState<
    'deadline' | 'participantsDesc' | 'participantsAsc' | 'prizeDesc' | 'prizeAsc'
  >('deadline');

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
        const statusOrder = { recruiting: 0, ongoing: 1, ended: 2 };
        const statusDiff = statusOrder[a.status] - statusOrder[b.status];
        if (statusDiff !== 0) return statusDiff;

        if (sortOption.startsWith('participants')) {
          return sortOption === 'participantsDesc'
            ? b.participantCount - a.participantCount
            : a.participantCount - b.participantCount;
        }

        if (sortOption.startsWith('prize')) {
          const prizeA = parseInt(a.prizeTotal?.replace(/[^0-9]/g, '') || '0', 10);
          const prizeB = parseInt(b.prizeTotal?.replace(/[^0-9]/g, '') || '0', 10);
          return sortOption === 'prizeDesc' ? prizeB - prizeA : prizeA - prizeB;
        }

        return new Date(a.period.endAt).getTime() - new Date(b.period.endAt).getTime();
      })
      .filter((hackathon) => {
        const statusMatch =
          !statusMap[statusFilter] || hackathon.status === statusMap[statusFilter];
        const typeMatch = selectedType === '전체' || hackathon.type === selectedType;
        const searchMatch =
          !query ||
          hackathon.title.toLowerCase().includes(query) ||
          hackathon.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          (hackathon.type?.toLowerCase().includes(query) ?? false);
        const bookmarkMatch =
          !showBookmarkedOnly || currentUser?.bookmarkedSlugs?.includes(hackathon.slug);
        return statusMatch && typeMatch && searchMatch && bookmarkMatch;
      });
  }, [hackathons, statusFilter, selectedType, searchQuery, showBookmarkedOnly, currentUser, sortOption]);

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
          지금 참가 가능한 해커톤과 진행 중인 대회를 한 번에 살펴보세요.
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

        {isDefaultFilter && <RecommendedSection />}

        <div className="flex items-center justify-between text-sm text-muted-foreground font-medium">
          <span>총 {filteredHackathons.length}개</span>
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value as typeof sortOption);
              setCurrentPage(1);
            }}
            className="bg-transparent border-none outline-none focus:ring-0 text-foreground cursor-pointer hover:text-primary transition-colors pr-2"
          >
            <option value="deadline">마감일 임박순</option>
            <option value="participantsDesc">참가 인원 많은순</option>
            <option value="participantsAsc">참가 인원 적은순</option>
            <option value="prizeDesc">상금 높은순</option>
            <option value="prizeAsc">상금 낮은순</option>
          </select>
        </div>

        {paginatedHackathons.length > 0 ? (
          <>
            <motion.div
              key={currentPage}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {paginatedHackathons.map((hackathon) => (
                <motion.div key={hackathon.slug} variants={itemVariants}>
                  <HackathonCard hackathon={hackathon} />
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
