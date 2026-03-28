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
import LeaderboardSection from '@/components/hackathon/LeaderboardSection';
import DeadlineWidget from '@/components/hackathon/DeadlineWidget';

const sections = [
  { id: 'overview', label: '개요', icon: BookOpen },
  { id: 'info', label: '안내', icon: Info },
  { id: 'eval', label: '평가', icon: BarChart },
  { id: 'schedule', label: '일정', icon: CalendarIcon },
  { id: 'prize', label: '상금', icon: Trophy },
  { id: 'teams', label: '팀', icon: Users },
  { id: 'submit', label: '제출', icon: Upload },
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

  // ── Tab State ──
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && (tab === 'info' || tab === 'teams' || tab === 'submit')) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
  const deadlineAt = hackathon.period.submissionDeadlineAt;

  // D-Day 계산
  const diffTime = new Date(deadlineAt).getTime() - new Date().getTime();
  const dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const dDayText = dDay > 0 ? `D-${dDay}` : dDay === 0 ? 'D-Day' : '종료';

  const stats = [
    { label: '총 상금', value: hackathon.prizeTotal || '자세히 보기', icon: Trophy, color: 'text-amber-500' },
    { label: '마감일', value: dDayText, icon: Clock, color: 'text-rose-500' },
    { label: '참가자', value: `${hackathon.participantCount}명`, icon: Users, color: 'text-blue-500' },
    { label: '분야', value: hackathon.type || '일반', icon: BookOpen, color: 'text-indigo-500' },
  ];

  const infoSections = [
    { id: 'overview', label: '개요', icon: BookOpen },
    { id: 'info', label: '안내', icon: Info },
    { id: 'eval', label: '평가', icon: BarChart },
    { id: 'schedule', label: '일정', icon: CalendarIcon },
    { id: 'prize', label: '상금', icon: Trophy },
  ];

  return (
    <div className="container mx-auto py-8 lg:py-12">
      <div className="flex flex-col gap-8">
        {/* 공통 헤더: 제목, 통계 바 */}
        <header className="space-y-6">
          <div className="flex flex-col gap-4">
            <Button
              variant="link"
              onClick={() => router.back()}
              className="p-0 h-auto w-fit text-muted-foreground hover:text-foreground no-underline"
            >
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              목록으로
            </Button>
            
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
                
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    {details.title}
                  </h1>
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
                <Button asChild variant="secondary" size="sm" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800">
                  <Link href={details.sections.info.links.rules} target="_blank"><FileText className="w-4 h-4 mr-1.5" /> 규정</Link>
                </Button>
                <Button asChild variant="secondary" size="sm" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800">
                  <Link href={details.sections.info.links.faq} target="_blank"><HelpCircle className="w-4 h-4 mr-1.5" /> FAQ</Link>
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
          <TabsList className="w-full justify-start h-12 bg-transparent p-0 border-b rounded-none mb-8">
            <TabsTrigger value="info" className="h-12 px-8 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none font-bold text-base">홈 / 정보</TabsTrigger>
            <TabsTrigger value="teams" className="h-12 px-8 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none font-bold text-base">팀 빌딩</TabsTrigger>
            <TabsTrigger value="submit" className="h-12 px-8 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none font-bold text-base">제출 & 결과</TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row md:gap-12 lg:gap-16">
            {!isMobile && activeTab === 'info' && (
              <div className="w-52 flex-shrink-0 sticky top-24 h-fit hidden md:flex flex-col gap-6">
                <SectionNav
                  sections={infoSections}
                  activeSection={activeTab === 'info' ? 'overview' : ''} // simple mock
                  onNavClick={handleNavClick}
                />
                <DeadlineWidget
                  deadlineAt={deadlineAt}
                  milestones={milestones}
                  timezone={details.sections.schedule.timezone}
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <TabsContent value="info" className="mt-0 space-y-0">
                <SectionWrapper id="overview" title="개요" icon={BookOpen}><OverviewSection overview={details.sections.overview} /></SectionWrapper>
                <SectionWrapper id="info" title="안내" icon={Info}><InfoSection info={details.sections.info} /></SectionWrapper>
                <SectionWrapper id="eval" title="평가" icon={BarChart}><EvalSection evalData={details.sections.eval} /></SectionWrapper>
                <SectionWrapper id="schedule" title="일정" icon={CalendarIcon}><ScheduleSection schedule={details.sections.schedule} /></SectionWrapper>
                <SectionWrapper id="prize" title="상금" icon={Trophy}><PrizeSection prize={details.sections.prize} /></SectionWrapper>
              </TabsContent>

              <TabsContent value="teams" className="mt-0">
                <SectionWrapper id="teams" title="팀 찾기" icon={Users} className="py-0">
                  <TeamsSection hackathonSlug={slug} teamPolicy={details.sections.overview.teamPolicy} />
                </SectionWrapper>
              </TabsContent>

              <TabsContent value="submit" className="mt-0 space-y-8">
                <SectionWrapper id="submit" title="제출" icon={Upload} className="py-0">
                  <SubmitSection hackathonSlug={slug} hackathonDetail={details} />
                </SectionWrapper>
                <SectionWrapper id="leaderboard" title="리더보드 및 결과" icon={Medal} className="py-10 border-t">
                  <LeaderboardSection leaderboard={leaderboard} hackathonDetail={details} status={hackathon.status} />
                </SectionWrapper>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
