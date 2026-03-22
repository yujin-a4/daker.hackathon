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
} from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/date';
import { getStatusColor, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ErrorState from '@/components/shared/ErrorState';
import LoadingState from '@/components/shared/LoadingState';
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
  const slug = params.slug as string;

  const { hackathonDetails, hackathons, leaderboards } = useHackathonStore();
  const { currentUser, toggleBookmark } = useUserStore();

  const hackathon = hackathons.find((h) => h.slug === slug);
  const details = hackathonDetails[slug];
  const leaderboard = leaderboards[slug];
  const isBookmarked = currentUser?.bookmarkedSlugs?.includes(slug);

  const isMobile = useIsMobile();

  // ── Scroll Spy ──
  const [activeSection, setActiveSection] = useState('overview');
  const isClickScrolling = useRef(false);
  const rafId = useRef<number>(0);

  // getBoundingClientRect 기반 — offsetTop 부모 기준 문제 완전 회피
  const updateActiveSection = useCallback(() => {
    if (isClickScrolling.current) return;

    const TRIGGER_LINE = 120; // 뷰포트 상단에서 120px 아래를 기준선으로 사용

    // 페이지 맨 아래 도달 시 마지막 섹션
    const scrollBottom = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    if (scrollBottom >= docHeight - 20) {
      setActiveSection(sections[sections.length - 1].id);
      return;
    }

    // 각 섹션의 뷰포트 기준 top을 계산
    let current = sections[0].id;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= TRIGGER_LINE) {
        current = sections[i].id;
        break;
      }
    }

    setActiveSection(current);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateActiveSection);
    };

    // 초기 상태 설정 (DOM 렌더 후)
    const initTimer = setTimeout(updateActiveSection, 300);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId.current);
      clearTimeout(initTimer);
    };
  }, [updateActiveSection, slug, details]);

  // ── Nav 클릭 시 스크롤 ──
  const handleNavClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    isClickScrolling.current = true;
    setActiveSection(id);

    // scroll-mt-20 = 80px이므로 약간의 여유를 두고 스크롤
    const rect = el.getBoundingClientRect();
    const scrollTo = window.scrollY + rect.top - 90;
    window.scrollTo({ top: scrollTo, behavior: 'smooth' });

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
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
  const firstMilestone = schedule.milestones[0];
  const lastMilestone = schedule.milestones[schedule.milestones.length - 1];

  return (
    <div className="container mx-auto py-8">
      {isMobile && (
        <SectionNav
          sections={sections}
          activeSection={activeSection}
          onNavClick={handleNavClick}
        />
      )}

      <div className="flex flex-col md:flex-row md:gap-12 lg:gap-16">
        {!isMobile && (
          <SectionNav
            sections={sections}
            activeSection={activeSection}
            onNavClick={handleNavClick}
          />
        )}

        <div className="flex-1 min-w-0">
          <header className="mb-8 md:mb-12">
            <Button
              variant="link"
              onClick={() => router.back()}
              className="p-0 h-auto mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              목록으로
            </Button>
            <div className="flex items-center gap-3 mb-3">
              <Badge
                className={cn('font-semibold', getStatusColor(hackathon.status))}
              >
                {statusText}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {details.title}
              </h1>
              <motion.button
                whileTap={{ scale: 1.2 }}
                onClick={handleBookmarkClick}
                aria-label="Bookmark hackathon"
              >
                <Heart
                  className={cn(
                    'w-6 h-6 text-slate-300 dark:text-slate-600 transition-colors',
                    isBookmarked && 'fill-red-500 text-red-500',
                  )}
                />
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-2 my-4">
              {hackathon.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="text-muted-foreground text-sm flex items-center gap-2 mb-5">
              <CalendarIcon className="w-4 h-4" />
              <span>
                {formatDate(firstMilestone.at)} ~ {formatDate(lastMilestone.at)}
              </span>
              <span className="text-slate-400 dark:text-slate-500">
                ({schedule.timezone})
              </span>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link
                  href={details.sections.info.links.rules}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="mr-1.5" /> 규정
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link
                  href={details.sections.info.links.faq}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <HelpCircle className="mr-1.5" /> FAQ
                </Link>
              </Button>
            </div>
          </header>

          <main>
            <SectionWrapper id="overview" title="개요" icon={BookOpen}>
              <OverviewSection overview={details.sections.overview} />
            </SectionWrapper>

            <SectionWrapper id="info" title="안내" icon={Info}>
              <InfoSection info={details.sections.info} />
            </SectionWrapper>

            <SectionWrapper id="eval" title="평가" icon={BarChart}>
              <EvalSection evalData={details.sections.eval} />
            </SectionWrapper>

            <SectionWrapper id="schedule" title="일정" icon={CalendarIcon}>
              <ScheduleSection schedule={details.sections.schedule} />
            </SectionWrapper>

            <SectionWrapper id="prize" title="상금" icon={Trophy}>
              <PrizeSection prize={details.sections.prize} />
            </SectionWrapper>

            <SectionWrapper id="teams" title="팀" icon={Users}>
              <TeamsSection
                hackathonSlug={slug}
                teamPolicy={details.sections.overview.teamPolicy}
              />
            </SectionWrapper>

            <SectionWrapper id="submit" title="제출" icon={Upload}>
              <SubmitSection hackathonSlug={slug} hackathonDetail={details} />
            </SectionWrapper>

            <SectionWrapper id="leaderboard" title="리더보드" icon={Medal}>
              <LeaderboardSection
                leaderboard={leaderboard}
                hackathonDetail={details}
                status={hackathon.status}
              />
            </SectionWrapper>
          </main>
        </div>
      </div>
    </div>
  );
}
