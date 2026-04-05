'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useUserStore } from '@/store/useUserStore';
import {
  ArrowLeft,
  BookOpen,
  Info,
  BarChart,
  Calendar as CalendarIcon,
  Trophy,
  Users,
  Upload,
  Medal,
  FileText,
  HelpCircle,
  Heart,
  Clock,
  Rocket,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { formatDate } from '@/lib/date';
import { getStatusColor, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ErrorState from '@/components/shared/ErrorState';
import LoadingState from '@/components/shared/LoadingState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionNav from '@/components/hackathon/SectionNav';
import SectionWrapper from '@/components/hackathon/SectionWrapper';
import OverviewSection from '@/components/hackathon/OverviewSection';
import InfoSection from '@/components/hackathon/InfoSection';
import EvalSection from '@/components/hackathon/EvalSection';
import ScheduleSection from '@/components/hackathon/ScheduleSection';
import PrizeSection from '@/components/hackathon/PrizeSection';
import TeamsSection from '@/components/hackathon/TeamsSection';
import SubmitSection from '@/components/hackathon/SubmitSection';
import GallerySection from '@/components/hackathon/GallerySection';
import LeaderboardSection from '@/components/hackathon/LeaderboardSection';
import DeadlineWidget from '@/components/hackathon/DeadlineWidget';
import ApplyModal from '@/components/hackathon/ApplyModal';
import DocumentModal from '@/components/hackathon/DocumentModal';
import MatchStatusTag from '@/components/hackathon/MatchStatusTag';
import { getHackathonPhase } from '@/lib/hackathon-utils';
import { useTeamStore } from '@/store/useTeamStore';
import { useSubmissionStore } from '@/store/useSubmissionStore';

const sections = [
  { id: 'info', label: '안내', icon: Info },
  { id: 'eval', label: '평가', icon: BarChart },
  { id: 'schedule', label: '일정', icon: CalendarIcon },
  { id: 'prize', label: '상금', icon: Trophy },
  { id: 'teams', label: '팀', icon: Users },
  { id: 'submit', label: '제출', icon: Upload },
  { id: 'gallery', label: '갤러리', icon: Rocket },
  { id: 'leaderboard', label: '리더보드', icon: Medal },
];

export default function HackathonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const slug = params?.slug as string;

  const { hackathonDetails, hackathons, leaderboards } = useHackathonStore();
  const { currentUser, toggleBookmark } = useUserStore();

  const hackathon = hackathons.find((h) => h.slug === slug);
  const details = hackathonDetails[slug];
  const leaderboard = leaderboards[slug];
  const isBookmarked = currentUser?.bookmarkedSlugs?.includes(slug);

  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const { teams } = useTeamStore();
  const { submissions: allSubmissions } = useSubmissionStore();
  
  const hackathonSubmissions = allSubmissions.filter(s => s.hackathonSlug === slug);
  const participantCount = teams.some(team => team.hackathonSlug === slug)
    ? teams
        .filter(team => team.hackathonSlug === slug)
        .reduce((sum, team) => sum + (team.memberCount || 0), 0)
    : (hackathon?.participantCount || 0);

  // ── Participation State ──
  const myTeam = teams.find(t => t.hackathonSlug === slug && currentUser?.teamCodes.includes(t.teamCode));
  const isParticipating = !!myTeam;

  // ── Apply Modal State ──
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const teamsSectionRef = useRef<HTMLDivElement>(null);

  // ── Document Modal State ──
  const [docModalState, setDocModalState] = useState<{isOpen: boolean, type: 'rules'|'faq'}>({ isOpen: false, type: 'rules' });

  // ── Tab State ──
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info');
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const tab = searchParams.get('tab');
    const validTabs = ['info', 'teams', 'submit', 'gallery', 'leaderboard'];
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // ── Scroll 이벤트 기반 섹션 추적 ──
  useEffect(() => {
    if (activeTab !== 'info') return;

    const sectionIds = ['overview', 'info', 'eval', 'schedule', 'prize'];
    const OFFSET = 140; // 헤더/탭 바 높이 보정

    const updateSection = () => {
      // 페이지 맨 아래 도달 시 마지막 섹션(상금) 강제 활성화
      const nearBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;
      if (nearBottom) {
        setActiveSection('prize');
        return;
      }

      // 각 섹션의 뷰포트 기준 top 계산
      const positions = sectionIds.map((id) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        return { id, top: el.getBoundingClientRect().top };
      });

      // 뷰포트 상단 기준 OFFSET 이하에서 가장 마지막(아래)으로 지나간 섹션
      const passed = positions.filter((p) => p.top <= OFFSET);
      if (passed.length > 0) {
        setActiveSection(passed[passed.length - 1].id);
      } else {
        setActiveSection('overview');
      }
    };

    // 마운트 직후 + DOM 렌더 후 초기화
    const timer = setTimeout(updateSection, 100);
    window.addEventListener('scroll', updateSection, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', updateSection);
    };
  }, [activeTab]);


  // ── Nav 클릭 시 스크롤 (Info 탭 내에서만 작동) ──
  const handleNavClick = useCallback((id: string) => {
    setActiveTab('info');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollTo = window.scrollY + rect.top - 100;
      window.scrollTo({ top: scrollTo, behavior: 'smooth' });
    }, 50);
  }, []);

  // ── Bookmark ──
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(slug);
    toast({
      title: isBookmarked ? '북마크를 제거했습니다.' : '북마크에 추가했습니다.',
    });
  };

  // ── Loading / Error ──
  if (!slug) return <LoadingState variant="detail" />;
  if (!hackathon || !details) {
    return (
      <div className="container mx-auto py-8 text-center">
        <ErrorState description="해커톤 정보를 찾을 수 없습니다." />
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/hackathons')}
        >
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  let statusText = '';
  switch (hackathon.status) {
    case 'ongoing':
      statusText = '진행중';
      break;
    case 'upcoming':
      statusText = '예정';
      break;
    case 'ended':
      statusText = '종료';
      break;
  }

  const schedule = details.sections.schedule;
  const firstMilestone = schedule.milestones?.[0];
  const lastMilestone = schedule.milestones?.length
    ? schedule.milestones[schedule.milestones.length - 1]
    : undefined;

  const milestones = details.sections.schedule.milestones || [];
  const deadlineAt = hackathon.period.endAt;

  // D-Day 계산
  const diffTime = new Date(deadlineAt).getTime() - new Date().getTime();
  const dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const dDayText = dDay > 0 ? `D-${dDay}` : dDay === 0 ? 'D-Day' : '종료';

  const stats = [
    { label: '총 상금', value: hackathon.prizeTotal || '자세히 보기', icon: Trophy, color: 'text-amber-500' },
    { label: '마감일', value: dDayText, icon: Clock, color: 'text-rose-500' },
    { label: '참가자', value: `${participantCount}명`, icon: Users, color: 'text-blue-500' },
    { label: '분야', value: hackathon.type || '일반', icon: BookOpen, color: 'text-indigo-500' },
  ];

  const infoSections = [
    { id: 'overview', label: '개요', icon: BookOpen },
    { id: 'info', label: '안내', icon: Info },
    { id: 'eval', label: '평가', icon: BarChart },
    { id: 'schedule', label: '일정', icon: CalendarIcon },
    { id: 'prize', label: '상금', icon: Trophy },
  ];

  const currentPhase = getHackathonPhase(details);
  const phases = [
    { key: 'PREPARATION', label: '모집' },
    { key: 'SUBMISSION', label: '제출' },
    { key: 'VOTING', label: '투표' },
    { key: 'JUDGING', label: '심사' },
    { key: 'RESULT', label: '발표' },
  ];

  return (
    <div className="container mx-auto py-8 lg:py-12">
      <div className="flex flex-col gap-6">
        {/* 공통 헤더: 제목, 통계 바 */}
        <header className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <Button
                variant="link"
                onClick={() => router.back()}
                className="p-0 h-auto w-fit text-muted-foreground hover:text-foreground no-underline"
              >
                <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                목록으로
              </Button>

              {/* Ultra-compact Phase Indicator */}
              <div className="flex items-center gap-1.5 md:gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-full border border-slate-200/60 dark:border-slate-800/60 w-fit shadow-sm">
                {phases.map((p, i) => {
                  const isActive = currentPhase.type === p.key;
                  const isDone = phases.findIndex(ph => ph.key === currentPhase.type) > i;
                  
                  return (
                    <div key={p.key} className="flex items-center gap-1.5 md:gap-2">
                      {isActive ? (
                        <span className="flex items-center gap-1.5 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm shadow-indigo-600/30">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          {p.label}
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            isDone ? "bg-indigo-400" : "bg-slate-200 dark:bg-slate-700"
                          )} />
                          <span className={cn(
                            "text-[11px] font-semibold uppercase tracking-wide transition-colors duration-300",
                            isDone ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-600"
                          )}>
                            {p.label}
                          </span>
                        </div>
                      )}
                      {i < phases.length - 1 && (
                        <div className={cn(
                          "w-2 md:w-5 h-[1.5px] rounded-full",
                          isDone ? "bg-indigo-300 dark:bg-indigo-700" : "bg-slate-200 dark:bg-slate-800"
                        )} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-3">
                  <Badge className={cn('px-2.5 py-0.5 rounded-full font-bold', getStatusColor(hackathon.status))}>
                    {statusText}
                  </Badge>
                  <div className="flex gap-2">
                    {hackathon.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    {details.title}
                  </h1>
                  
                  {currentUser && (
                    <MatchStatusTag 
                      hackathon={hackathon} 
                      currentUser={currentUser}
                      isParticipating={isParticipating}
                      basecampUrl={myTeam ? `/basecamp/${myTeam.teamCode}` : undefined}
                      onGoToTeamBuilding={() => {
                        setActiveTab('teams');
                        router.replace(`/hackathons/${slug}?tab=teams`, { scroll: false });
                        setTimeout(() => {
                          const el = document.getElementById('teams');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                    />
                  )}

                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    onClick={handleBookmarkClick}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Heart className={cn('w-7 h-7 text-slate-300 dark:text-slate-600', isBookmarked && 'fill-rose-500 text-rose-500')} />
                  </motion.button>
                </div>
                
                {firstMilestone && lastMilestone && (
                  <p className="text-muted-foreground flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="font-semibold">{formatDate(firstMilestone.at)}</span>
                    <span className="opacity-50">—</span>
                    <span className="font-semibold">{formatDate(lastMilestone.at)}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setDocModalState({isOpen: true, type: 'rules'})} variant="secondary" size="sm" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800">
                  <FileText className="w-4 h-4 mr-1.5" /> 규정
                </Button>
                <Button onClick={() => setDocModalState({isOpen: true, type: 'faq'})} variant="secondary" size="sm" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800">
                  <HelpCircle className="w-4 h-4 mr-1.5" /> FAQ
                </Button>
              </div>
            </div>
          </div>

          {/* 퀵 스탯 바 (가독성 포인트) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors", stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-base font-extrabold text-slate-800 dark:text-slate-200">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* 탭 구조 */}
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full overflow-x-auto no-scrollbar border-b mb-8">
            <TabsList className="inline-flex w-auto md:w-full justify-start h-12 bg-transparent p-0 rounded-none border-none">
              <TabsTrigger value="info" className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none font-bold text-sm md:text-base whitespace-nowrap">홈 / 정보</TabsTrigger>
              <TabsTrigger value="teams" className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none font-bold text-sm md:text-base whitespace-nowrap">팀 빌딩</TabsTrigger>
              <TabsTrigger value="submit" className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none font-bold text-sm md:text-base whitespace-nowrap">제출</TabsTrigger>
              <TabsTrigger value="gallery" className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none font-bold text-sm md:text-base whitespace-nowrap">갤러리/투표</TabsTrigger>
              <TabsTrigger value="leaderboard" className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none font-bold text-sm md:text-base whitespace-nowrap font-mono">RANKING</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-col md:flex-row md:gap-12 lg:gap-16">
            {!isMobile && activeTab === 'info' && (
              <div className="w-56 flex-shrink-0 sticky top-6 h-fit hidden md:flex flex-col gap-4">
                {/* 참가 버튼 — 최상단 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {isParticipating ? '참가 중' : 'Participation'}
                  </p>
                  {isParticipating ? (
                    <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 h-10 font-bold shadow-lg shadow-indigo-600/20">
                      <Link href={`/basecamp/${myTeam.teamCode}`}>나의 베이스캠프 가기</Link>
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setIsApplyModalOpen(true)} 
                      disabled={hackathon.status === 'ended'}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 h-10 font-bold shadow-lg shadow-indigo-600/20"
                    >
                      참가 신청하기
                    </Button>
                  )}
                  <p className="text-[11px] text-slate-400 text-center">
                    {hackathon.status === 'ended' ? '이 대회는 종료되었습니다.' : isParticipating ? '이미 참가 중인 대회입니다.' : '현재 많은 분석가들이 참여하고 있습니다.'}
                  </p>
                </div>

                {/* 앵커 내비게이션 — 카운트다운 위에 */}
                <SectionNav
                  sections={infoSections}
                  activeSection={activeSection}
                  onNavClick={handleNavClick}
                />

                {/* 카운트다운 위젯 */}
                <DeadlineWidget
                  deadlineAt={deadlineAt}
                  milestones={milestones}
                  timezone={details.sections.schedule.timezone}
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Mobile Match Analysis card removed — clean header → stats → tabs → content flow */}
              <TabsContent value="info" className="mt-0 space-y-0">
                <SectionWrapper id="overview" title="개요" icon={BookOpen}><OverviewSection overview={details.sections.overview} /></SectionWrapper>
                <SectionWrapper id="info" title="안내" icon={Info}><InfoSection info={details.sections.info} onOpenDoc={(type) => setDocModalState({isOpen: true, type})} /></SectionWrapper>
                <SectionWrapper id="eval" title="평가" icon={BarChart}><EvalSection evalData={details.sections.eval} /></SectionWrapper>
                <SectionWrapper id="schedule" title="일정" icon={CalendarIcon}><ScheduleSection schedule={details.sections.schedule} /></SectionWrapper>
                <SectionWrapper id="prize" title="상금" icon={Trophy}><PrizeSection prize={details.sections.prize} /></SectionWrapper>
              </TabsContent>

              <TabsContent value="teams" className="mt-0">
                <SectionWrapper id="teams" title="팀 찾기" icon={Users} className="py-0">
                  <TeamsSection hackathonSlug={slug} teamPolicy={details.sections.overview.teamPolicy} />
                </SectionWrapper>
              </TabsContent>

              <TabsContent value="submit" className="mt-0">
                <SectionWrapper id="submit" title="제출" icon={Upload} className="py-0">
                  <SubmitSection hackathonSlug={slug} hackathonDetail={details} />
                </SectionWrapper>
              </TabsContent>

              <TabsContent value="gallery" className="mt-0">
                <SectionWrapper id="gallery" title="갤러리" icon={Rocket} className="py-0">
                  <GallerySection 
                    leaderboard={leaderboard} 
                    hackathonDetail={details} 
                    submissions={hackathonSubmissions} 
                  />
                </SectionWrapper>
              </TabsContent>

              <TabsContent value="leaderboard" className="mt-0">
                <SectionWrapper id="leaderboard" title="리더보드" icon={Medal} className="py-0">
                  <LeaderboardSection 
                    leaderboard={leaderboard} 
                    hackathonDetail={details} 
                    submissions={hackathonSubmissions}
                  />
                </SectionWrapper>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="container mx-auto max-w-lg flex gap-3">
            {isParticipating ? (
              <Button asChild className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-bold text-base shadow-lg shadow-indigo-600/20">
                <Link href={`/basecamp/${myTeam.teamCode}`}>
                  <Rocket className="w-5 h-5 mr-2" /> 나의 베이스캠프
                </Link>
              </Button>
            ) : (
              <Button 
                onClick={() => setIsApplyModalOpen(true)}
                disabled={hackathon.status === 'ended'}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-bold text-base shadow-lg shadow-indigo-600/20"
              >
                참가 신청하기 <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBookmarkClick}
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 transition-colors",
                isBookmarked ? "bg-rose-50 border-rose-100 text-rose-500" : "bg-white dark:bg-slate-900 text-slate-400"
              )}
            >
              <Heart className={cn("w-6 h-6", isBookmarked && "fill-current")} />
            </motion.button>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onOpenChange={setIsApplyModalOpen}
        hackathonSlug={slug}
        hackathonTitle={hackathon.title}
        teamPolicy={details.sections.overview.teamPolicy}
        onSwitchToTeams={() => {
          setActiveTab('teams');
          router.replace(`/hackathons/${slug}?tab=teams`, { scroll: false });
          setTimeout(() => {
            const el = document.getElementById('teams');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onCreateTeam={() => {
          setActiveTab('teams');
          router.replace(`/hackathons/${slug}?tab=teams&action=create-team`, { scroll: false });
          setTimeout(() => {
            const el = document.getElementById('teams');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* Document Modal */}
      <DocumentModal
        isOpen={docModalState.isOpen}
        onOpenChange={(isOpen) => setDocModalState(prev => ({ ...prev, isOpen }))}
        type={docModalState.type}
        hackathonTitle={details.title}
      />

      {/* Padding for mobile fixed bar */}
      {isMobile && <div className="h-20" />}
    </div>
  );
}
