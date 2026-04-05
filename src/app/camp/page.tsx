'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Plus, ArrowRight } from 'lucide-react';

import { useTeamStore } from '@/store/useTeamStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useUserStore } from '@/store/useUserStore';
import type { Team } from '@/types';
import { calculateMatchScore, MatchingResult } from '@/lib/matching';
import { isHackathonRecruiting } from '@/lib/hackathon-utils';
import RecommendedTeamSection from '@/components/camp/RecommendedTeamSection';

import TeamFilters from '@/components/camp/TeamFilters';
import TeamCard from '@/components/camp/TeamCard';
import CreateTeamModal from '@/components/camp/CreateTeamModal';
import TeamDetailModal from '@/components/camp/TeamDetailModal';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  const { currentUser } = useUserStore();
  
  const [hackathonFilter, setHackathonFilter] = useState(searchParams.get('hackathon') || 'all');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  
  // 섹션별 전체 보기 상태
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // 추천: ended 해커톤 팀 제외, 내 팀 제외, isSolo 제외, isOpen 팀 우선 → 상위 3개
  const recommendedTeams = useMemo(() => {
    if (!currentUser) return [];
    const activeHackathonSlugs = new Set(
      hackathons.filter(isHackathonRecruiting).map(h => h.slug)
    );
    const eligibleTeams = teams.filter(t =>
      !t.isSolo &&
      !currentUser.teamCodes.includes(t.teamCode) &&
      t.hackathonSlug &&
      activeHackathonSlugs.has(t.hackathonSlug)
    );
    return eligibleTeams
      .map(t => calculateMatchScore(currentUser, t))
      .sort((a, b) => {
        if (a.team.isOpen !== b.team.isOpen) return b.team.isOpen ? 1 : -1;
        return b.score - a.score;
      })
      .slice(0, 3);
  }, [currentUser, teams, hackathons]);

  const toggleSection = (slug: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };
  
  useEffect(() => {
    const createParam = searchParams.get('create');
    if (createParam === 'true') {
      setIsModalOpen(true);
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
  
  // 진행 중/예정인 해커톤 slug 세트 (ended 팀 필터링용)
  const activeHackathonSlugs = useMemo(() =>
    new Set(hackathons.filter(isHackathonRecruiting).map(h => h.slug)),
    [hackathons]
  );

  const groupedTeams = useMemo(() => {
    const groups: Record<string, MatchingResult[]> = {};

    const baseFiltered = teams.filter(team => {
      if (team.isSolo) return false;
      // ended 해커톤 팀은 숨김
      if (team.hackathonSlug && !activeHackathonSlugs.has(team.hackathonSlug)) return false;
      const openMatch = !showOpenOnly || team.isOpen;
      const publicMatch = !showPublicOnly || !team.isPrivate;
      const searchMatch = searchQuery === '' ||
                          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          team.intro.toLowerCase().includes(searchQuery.toLowerCase());
      const positionMatch = positionFilter === 'all' ||
                            team.lookingFor.some(lf => lf.position.toLowerCase().includes(positionFilter.toLowerCase()));
      return openMatch && publicMatch && searchMatch && positionMatch;
    });

    baseFiltered.forEach(team => {
      const slug = team.hackathonSlug || 'general';
      if (!groups[slug]) groups[slug] = [];
      groups[slug].push(
        currentUser
          ? calculateMatchScore(currentUser, team)
          : { team, score: 0, matchReasons: [] }
      );
    });

    Object.values(groups).forEach(group => {
      group.sort((a, b) => {
        if (currentUser) return b.score - a.score;
        return new Date(b.team.createdAt).getTime() - new Date(a.team.createdAt).getTime();
      });
    });

    if (hackathonFilter !== 'all') {
      return { [hackathonFilter]: groups[hackathonFilter] || [] };
    }

    return groups;
  }, [teams, hackathonFilter, showOpenOnly, showPublicOnly, searchQuery, positionFilter, activeHackathonSlugs, currentUser]);

  const activeGroups = Object.keys(groupedTeams).filter(slug => groupedTeams[slug].length > 0);

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">팀 빌딩</h1>
        <p className="mt-2 text-muted-foreground">함께 할 팀원을 찾거나, 새로운 팀을 만들어보세요.</p>
      </header>

      <div className="space-y-10">
        {/* ✨ AI 추천 섹션 (Premium Upgrade) */}
        {!searchQuery && (
          <RecommendedTeamSection 
            recommendations={recommendedTeams} 
            onEdit={handleEdit} 
            handleCardClick={handleCardClick}
            userNickname={currentUser?.nickname}
          />
        )}

        {/* 🔍 필터 바 (Sticky & Minimal) */}
        <div className="sticky top-[4.5rem] z-30 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md py-4 border-y border-slate-100 dark:border-slate-800 transition-all">
          <TeamFilters
            hackathonFilter={hackathonFilter}
            setHackathonFilter={setHackathonFilter}
            showOpenOnly={showOpenOnly}
            setShowOpenOnly={setShowOpenOnly}
            showPublicOnly={showPublicOnly}
            setShowPublicOnly={setShowPublicOnly}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            positionFilter={positionFilter}
            setPositionFilter={setPositionFilter}
            hackathons={hackathons.filter(isHackathonRecruiting)}
          />
          <Button onClick={handleCreateNew} className="w-full md:w-auto shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> 팀 모집글 작성
          </Button>
        </div>

        {activeGroups.length > 0 ? (
          <div className="space-y-12 pb-20">
            {activeGroups.map((slug) => {
              const hackathon = hackathons.find(h => h.slug === slug);
              const groupTeams = groupedTeams[slug];
              const title = hackathon ? hackathon.title : "자유 모집 (대회 무관)";
              const isExpanded = expandedSections.has(slug) || hackathonFilter !== 'all';
              const displayTeams = isExpanded ? groupTeams : groupTeams.slice(0, 6);
              
              return (
                <section key={slug} className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-5 bg-primary rounded-full" />
                      <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{title}</h2>
                        <p className="text-xs text-muted-foreground">{groupTeams.length}개 팀 모집 중</p>
                      </div>
                    </div>
                    {hackathon && (
                      <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/5 h-8">
                        <Link href={`/hackathons/${slug}`} className="text-xs font-bold">대회 상세</Link>
                      </Button>
                    )}
                  </div>

                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {displayTeams.map((match) => (
                      <TeamCard 
                        key={match.team.teamCode} 
                        team={match.team} 
                        onEdit={handleEdit} 
                        onCardClick={handleCardClick}
                        matchScore={match.score}
                      />
                    ))}
                  </motion.div>

                  {!isExpanded && groupTeams.length > 6 && (
                    <div className="flex justify-center pt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleSection(slug)}
                        className="font-bold text-slate-600 rounded-full px-6"
                      >
                        {groupTeams.length - 6}개 팀 더 보기 <ArrowRight className="ml-2 w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
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
