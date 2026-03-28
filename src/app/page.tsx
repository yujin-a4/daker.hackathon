'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Trophy, Users, Boxes, Rocket } from 'lucide-react';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import HackathonCard from '@/components/hackathon/HackathonCard';
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
  }).filter(item => item.hackathon);

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
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tighter">
            함께 도전하고, 함께 성장하세요
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            해커톤 참여부터 팀 빌딩, 순위 확인까지 한곳에서.
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
        <section className="py-12 bg-primary/5 dark:bg-primary/10 border-y border-primary/10">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Rocket className="w-6 h-6 text-primary" />
              나의 베이스캠프
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myHackathons.map(({ team, hackathon }) => (
                <div key={team.teamCode} className="bg-background rounded-xl p-6 border shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between hover:border-primary/30 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        진행 중
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">{hackathon?.title}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">팀 {team.name}</h3>
                    <p className="text-sm text-muted-foreground">현재 나의 팀과 함께 작전을 세워보세요.</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0 flex-col sm:flex-row">
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <Link href={`/hackathons/${hackathon?.slug}`}>
                        해커톤 정보 보기
                      </Link>
                    </Button>
                    <Button asChild className="w-full sm:w-auto gap-2">
                      <Link href={`/basecamp/${team.teamCode}`}>
                        <Rocket className="w-4 h-4" />
                        작전실 입장
                      </Link>
                    </Button>
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
