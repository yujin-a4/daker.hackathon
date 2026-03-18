'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';

import { useTeamStore } from '@/store/useTeamStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import type { Team } from '@/types';

import TeamFilters from '@/components/camp/TeamFilters';
import TeamCard from '@/components/camp/TeamCard';
import CreateTeamModal from '@/components/camp/CreateTeamModal';
import TeamDetailModal from '@/components/camp/TeamDetailModal';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

function CampContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { teams } = useTeamStore();
  const { hackathons } = useHackathonStore();
  
  const [hackathonFilter, setHackathonFilter] = useState(searchParams.get('hackathon') || 'all');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  
  useEffect(() => {
    const createParam = searchParams.get('create');
    if (createParam === 'true') {
      setIsModalOpen(true);
      // Avoid re-opening modal on router changes
      router.replace('/camp', undefined);
    }
  }, [searchParams, router]);
  
  const handleCreateNew = () => {
    setEditingTeam(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleCardClick = (team: Team) => {
    setSelectedTeam(team);
    setIsDetailModalOpen(true);
  };
  
  const filteredTeams = useMemo(() => {
    return teams.filter(team => {
      const hackathonMatch = hackathonFilter === 'all' || team.hackathonSlug === hackathonFilter;
      const openMatch = !showOpenOnly || team.isOpen;
      const searchMatch = searchQuery === '' || 
                          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          team.intro.toLowerCase().includes(searchQuery.toLowerCase());
      return hackathonMatch && openMatch && searchMatch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [teams, hackathonFilter, showOpenOnly, searchQuery]);

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">팀원 모집</h1>
        <p className="mt-2 text-muted-foreground">함께 할 팀원을 찾거나, 새로운 팀을 만들어보세요.</p>
      </header>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <TeamFilters
            hackathonFilter={hackathonFilter}
            setHackathonFilter={setHackathonFilter}
            showOpenOnly={showOpenOnly}
            setShowOpenOnly={setShowOpenOnly}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            hackathons={hackathons}
          />
          <Button onClick={handleCreateNew} className="w-full md:w-auto">
            <Plus /> 새 모집글 작성하기
          </Button>
        </div>

        <div className="text-sm text-muted-foreground font-medium">
          총 {filteredTeams.length}개 팀
        </div>

        {filteredTeams.length > 0 ? (
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredTeams.map((team) => (
              <TeamCard key={team.teamCode} team={team} onEdit={handleEdit} onCardClick={handleCardClick} />
            ))}
          </motion.div>
        ) : (
          <div className="pt-8">
            <EmptyState
              icon={Users}
              title={teams.length === 0 ? "아직 등록된 팀이 없습니다" : "조건에 맞는 팀이 없습니다"}
              description={teams.length === 0 ? "가장 먼저 팀을 만들어보세요!" : "필터를 변경해보세요."}
              actionLabel={teams.length === 0 ? "팀 만들기" : undefined}
              onAction={teams.length === 0 ? handleCreateNew : undefined}
            />
          </div>
        )}
      </div>
      
      <CreateTeamModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingTeam={editingTeam}
        defaultHackathonSlug={searchParams.get('hackathon') || undefined}
      />

      <TeamDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        team={selectedTeam}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default function CampPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CampContent />
    </Suspense>
  )
}
