'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useHackathonStore } from '@/store/useHackathonStore';
import {
  ArrowLeft,
  BookOpen,
  Info,
  BarChart,
  Calendar as CalendarIcon,
  Trophy,
  Users,
  FileText,
  HelpCircle,
  ClipboardList,
  GitMerge,
} from 'lucide-react';

import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useIsMobile } from '@/hooks/use-mobile';
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

const sections = [
  { id: 'overview', label: '개요', icon: BookOpen },
  { id: 'info', label: '안내', icon: Info },
  { id: 'eval', label: '평가', icon: BarChart },
  { id: 'schedule', label: '일정', icon: CalendarIcon },
  { id: 'prize', label: '상금', icon: Trophy },
  { id: 'teams', label: '팀', icon: Users },
  { id: 'submit', label: '제출', icon: ClipboardList },
  { id: 'leaderboard', label: '리더보드', icon: GitMerge },
];

export default function HackathonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { hackathonDetails, hackathons } = useHackathonStore();
  const hackathon = hackathons.find((h) => h.slug === slug);
  const details = hackathonDetails[slug];

  const activeSection = useScrollSpy(
    sections.map((s) => `#${s.id}`),
    { rootMargin: '-20% 0px -75% 0px' }
  );
  
  const isMobile = useIsMobile();

  if (!slug) return <LoadingState variant="detail" />;
  if (!hackathon || !details) {
    return (
      <div className="container mx-auto py-8">
        <ErrorState description="해커톤 정보를 찾을 수 없습니다." />
      </div>
    );
  }

  let statusText = '';
  switch (hackathon.status) {
    case 'ongoing': statusText = '진행중'; break;
    case 'upcoming': statusText = '예정'; break;
    case 'ended': statusText = '종료'; break;
  }
  
  const schedule = details.sections.schedule;
  const firstMilestone = schedule.milestones[0];
  const lastMilestone = schedule.milestones[schedule.milestones.length - 1];

  return (
    <div className="container mx-auto py-8">
      {isMobile && <SectionNav sections={sections} activeSection={activeSection} />}

      <div className="flex flex-col md:flex-row md:gap-12 lg:gap-16">
        {!isMobile && <SectionNav sections={sections} activeSection={activeSection} />}
        
        <div className="flex-1 min-w-0">
          <header className="mb-8 md:mb-12">
            <Button variant="link" onClick={() => router.back()} className="p-0 h-auto mb-4 text-slate-500 hover:text-slate-700">
              <ArrowLeft className="mr-1 h-4 w-4" />
              목록으로
            </Button>
            <div className="flex items-center gap-3 mb-3">
              <Badge className={cn('font-semibold', getStatusColor(hackathon.status))}>{statusText}</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">{details.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {hackathon.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
            <div className="text-slate-500 text-sm flex items-center gap-2 mb-5">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(firstMilestone.at)} ~ {formatDate(lastMilestone.at)}</span>
              <span className="text-slate-400">({schedule.timezone})</span>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="bg-white">
                <Link href={details.sections.info.links.rules} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-1.5" /> 규정
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="bg-white">
                <Link href={details.sections.info.links.faq} target="_blank" rel="noopener noreferrer">
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
              <p className="text-muted-foreground text-center py-8">팀 섹션 준비 중</p>
            </SectionWrapper>
            
            <SectionWrapper id="submit" title="제출" icon={ClipboardList}>
               <p className="text-muted-foreground text-center py-8">제출 섹션 준비 중</p>
            </SectionWrapper>

            <SectionWrapper id="leaderboard" title="리더보드" icon={GitMerge}>
              <p className="text-muted-foreground text-center py-8">리더보드 준비 중</p>
            </SectionWrapper>
          </main>
        </div>
      </div>
    </div>
  );
}