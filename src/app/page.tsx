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

function QuickCard({ icon: Icon, title, desc, link }: { icon: React.ElementType; title: string; desc: string; link: string }) {
  return (
    <Link href={link} className="group">
      <div className="bg-card/80 dark:bg-card/50 backdrop-blur rounded-xl p-5 border shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold group-hover:text-primary transition-colors">{title}</p>
            <p className="text-xs text-muted-foreground truncate">{desc}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto flex-shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
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
      <section className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-violet-100/50 dark:from-indigo-950/50 dark:to-violet-950/50 opacity-50"></div>
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}
        />
        <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1]">
            MAXER
            <span className="block text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#06B6D4] mt-2">
              해커톤 참여·성장·커리어를 잇는 통합 플랫폼
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-medium">
            도전의 한계를 넘어 성장의 자산으로, <br className="hidden sm:block" />
            해커톤의 모든 여정을 <span className="text-foreground font-bold">MAX</span>로 기록하다
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/hackathons">
              해커톤 둘러보기 <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          {/* 빠른 시작 */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <QuickCard
              icon={Trophy}
              title="해커톤"
              desc={`${ongoingHackathons.length}개 진행중`}
              link="/hackathons"
            />
            <QuickCard
              icon={Users}
              title="팀 찾기"
              desc={`${openTeamsCount}개 팀 모집중`}
              link="/camp"
            />
            <QuickCard
              icon={BarChart3}
              title="랭킹"
              desc="나의 순위 확인"
              link="/rankings"
            />
          </div>
        </div>
      </section>

      {/* 내 작전실 (참여중인 해커톤) */}
      {myHackathons.length > 0 && (
        <section className="py-16 bg-slate-50/30 dark:bg-slate-950/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-indigo-500 rounded-full" />
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Operational Hub</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">
                  My Basecamp
                </h2>
                <p className="text-sm text-muted-foreground font-medium max-w-md">현재 활발히 빌딩 중인 프로젝트 작전실입니다. 실시간 진행도와 마일스톤을 확인하세요.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myHackathons.map(({ team, hackathon }) => (
                <div 
                  key={team.teamCode}
                  className="group relative bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-2xl hover:border-indigo-500/20 transition-all duration-500"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                    <Rocket className="w-24 h-24" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-2 inline-block" />
                        In Progress
                      </Badge>
                      <span className="text-[11px] font-bold text-slate-400 truncate max-w-[200px]">{hackathon?.title}</span>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1.5 leading-tight">
                        Team <span className="text-indigo-600 dark:text-indigo-400">{team.name}</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                         {team.progressStatus === 'developing' ? '현재 핵심 기능 고도화 작업 중' : '프로젝트 기획 및 MVP 설계 진행 중'}
                      </p>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-end">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Overall Progress</span>
                          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">{team.progressPercent || 40}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${team.progressPercent || 40}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500" 
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Button asChild className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl h-12 font-extrabold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all duration-300">
                          <Link href={`/basecamp/${team.teamCode}`}>
                            베이스캠프 입장
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="w-12 h-12 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
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
      <section className="py-16 lg:py-24 bg-muted/20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">진행 중인 해커톤</h2>
            <Button asChild variant="link">
              <Link href="/hackathons">
                모든 해커톤 보기 <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {ongoingHackathons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingHackathons.slice(0, 3).map(hackathon => (
                <HackathonCard key={hackathon.slug} hackathon={hackathon} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Boxes}
              title="진행 중인 해커톤이 없습니다"
              description="새로운 해커톤이 곧 열릴 예정입니다. 조금만 기다려주세요!"
            />
          )}
        </div>
      </section>
    </div>
  );
}
