'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Trophy, Users, Boxes, Rocket, Info } from 'lucide-react';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import HackathonCard from '@/components/hackathon/HackathonCard';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/shared/EmptyState';
import RecommendedSection from '@/components/hackathon/RecommendedSection';

function QuickCard({ title, value, label, link }: { title: string; value: string | number | undefined; label: string; link: string }) {
  const displayValue = (value === 0 || value === undefined || value === null) ? '—' : value;
  
  return (
    <Link href={link} className="group">
      <div className="bg-card border border-border rounded-[10px] p-[24px] transition duration-200 hover:border-primary text-left">
        <h4 className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em] mb-2">{title}</h4>
        <div className="flex items-baseline justify-between">
          <span className="text-[32px] font-bold text-foreground leading-none">{displayValue}</span>
          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
        </div>
        <p className="text-[12px] text-muted-foreground mt-1">{label}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  const { currentUser } = useUserStore();
  const { hackathons } = useHackathonStore();
  const { teams } = useTeamStore();

  const ongoingHackathons = hackathons.filter(h => h.status === 'ongoing');
  const openTeamsCount = teams.filter(t => t.isOpen).length;

  const myTeams = currentUser ? teams.filter(t => currentUser.teamCodes.includes(t.teamCode)) : [];
  const myHackathons = myTeams.map(team => {
    const hackathon = hackathons.find(h => h.slug === team.hackathonSlug);
    return { team, hackathon };
  }).filter(item => item.hackathon && item.hackathon.status !== 'ended');

  return (
    <div>
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative bg-background py-[120px] overflow-hidden text-center">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          <span className="bg-primary/10 border border-primary text-primary rounded-full px-[14px] py-[4px] text-[12px] font-medium mb-6">
            🚀 해커톤 플랫폼
          </span>
          <h1 className="text-[72px] font-bold text-foreground tracking-[-0.02em] leading-[1.1] mb-6">
            <span className="text-primary">MAX</span>ER
          </h1>
          <p className="text-[18px] font-normal text-muted-foreground max-w-[600px] mb-10">
            도전의 한계를 넘어 성장의 자산으로. 해커톤 참여부터 팀 빌딩, 커리어 성장까지 모든 여정을 통합 관리하세요.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-4 mb-[80px]">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-[6px] px-[28px] py-[12px] h-auto font-semibold text-[15px] transition duration-150 hover:-translate-y-[1px]">
              <Link href="/hackathons">해커톤 둘러보기</Link>
            </Button>
          </div>

          {/* 빠른 시작 카드 (가로 배치) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-[16px] mb-16">
            <QuickCard title="해커톤" value={ongoingHackathons.length} label="현재 진행중" link="/hackathons" />
            <QuickCard title="팀 찾기" value={openTeamsCount} label="멤버 모집중" link="/camp" />
            <QuickCard title="랭킹" value={currentUser ? 12 : undefined} label="나의 현재 순위" link="/rankings" />
          </div>

          {/* Stats */}
          <div className="w-full pt-[40px] border-t border-border flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-[120px]">
            <div className="text-center">
              <p className="text-[36px] font-bold text-foreground leading-none">1,240+</p>
              <p className="text-[12px] text-muted-foreground mt-2 uppercase tracking-[0.06em]">해커톤 참여자</p>
            </div>
            <div className="text-center">
              <p className="text-[36px] font-bold text-foreground leading-none">38</p>
              <p className="text-[12px] text-muted-foreground mt-2 uppercase tracking-[0.06em]">누적 해커톤</p>
            </div>
            <div className="text-center">
              <p className="text-[36px] font-bold text-foreground leading-none">310+</p>
              <p className="text-[12px] text-muted-foreground mt-2 uppercase tracking-[0.06em]">결성된 팀</p>
            </div>
          </div>
        </div>
      </section>

      {/* 내 작전실 (참여중인 해커톤) */}
      {myHackathons.length > 0 && (
        <section className="py-20 bg-background border-y border-border">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-[1px] bg-primary" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Operational Hub</span>
                </div>
                <h2 className="text-[40px] font-bold text-foreground tracking-tight">
                  My Basecamp
                </h2>
                <p className="text-[15px] text-muted-foreground max-w-md leading-relaxed">현재 프로젝트가 진행 중인 공간입니다. 실시간 진척도와 주요 마일스톤을 관리하세요.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {myHackathons.map(({ team, hackathon }) => (
                <div 
                  key={team.teamCode}
                  className="group relative bg-card rounded-[10px] border border-border p-8 transition-all duration-200 hover:border-primary"
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-8">
                      <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-[6px] font-medium text-[10px] uppercase tracking-widest">
                        <span className="w-1 h-1 rounded-full bg-primary mr-2 inline-block" />
                        In Progress
                      </Badge>
                      <span className="text-[12px] text-muted-foreground truncate max-w-[200px]">{hackathon?.title}</span>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-[24px] font-bold text-foreground mb-2">
                        Team <span className="text-secondary-foreground">{team.name}</span>
                      </h3>
                      <p className="text-[14px] text-muted-foreground leading-relaxed">
                         {team.progressStatus === 'developing' ? '현재 핵심 기능 고도화 작업 중' : '프로젝트 기획 및 MVP 설계 진행 중'}
                      </p>
                    </div>

                    <div className="mt-auto space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Progress</span>
                          <span className="text-[20px] font-bold text-foreground">{team.progressPercent || 40}%</span>
                        </div>
                        <div className="h-[2px] w-full bg-border rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${team.progressPercent || 40}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-primary" 
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-[6px] h-12 font-medium text-[14px] shadow-none transition-all duration-300">
                          <Link href={`/basecamp/${team.teamCode}`}>
                            베이스캠프 입장
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="w-12 h-12 rounded-[6px] border-border text-muted-foreground hover:border-primary hover:text-foreground hover:bg-transparent transition-all">
                          <Link href={`/hackathons/${hackathon?.slug}`}>
                            <Info className="w-5 h-5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 개인화 추천 섹션 */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecommendedSection />
        </div>
      </section>

      {/* Ongoing Hackathons Section */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-baseline mb-12">
            <h2 className="text-[32px] font-bold text-foreground">진행 중인 해커톤</h2>
            <Button asChild variant="link" className="text-muted-foreground hover:text-primary p-0 h-auto">
              <Link href="/hackathons" className="flex items-center gap-1">
                모든 해커톤 보기 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {ongoingHackathons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ongoingHackathons.slice(0, 3).map(hackathon => (
                <HackathonCard key={hackathon.slug} hackathon={hackathon} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Rocket}
              title="아직 진행 중인 해커톤이 없어요"
              description="새로운 해커톤이 열리면 가장 먼저 알려드릴게요"
            >
              <div className="flex gap-2 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="flex-grow px-4 py-3 rounded-[6px] bg-card border border-border text-foreground text-[14px] focus:outline-none focus:border-primary transition-colors"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-[6px] px-6 h-auto text-[14px] transition duration-150">
                  구독하기
                </Button>
              </div>
            </EmptyState>
          )}
        </div>
      </section>
    </div>
  );
}
