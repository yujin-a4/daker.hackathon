'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Trophy, Users, Boxes } from 'lucide-react';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useTeamStore } from '@/store/useTeamStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import HackathonCard from '@/components/hackathon/HackathonCard';
import EmptyState from '@/components/shared/EmptyState';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-card/80 dark:bg-card/50 backdrop-blur rounded-xl p-6 border shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold text-primary mt-1">{value}</p>
    </div>
  );
}

function QuickAccessCard({ icon: Icon, title, description, link, linkText }: { icon: React.ElementType, title: string, description: string, link: string, linkText: string }) {
  return (
    <Link href={link} className="block group">
      <Card className="h-full bg-card rounded-2xl p-8 border shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-200">
        <CardHeader className="p-0 items-start">
          <div className="bg-primary/10 text-primary rounded-full p-3 mb-4">
            <Icon className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-2">
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter className="p-0 mt-6">
          <span className="text-sm font-semibold text-primary group-hover:underline flex items-center gap-1">
            {linkText} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default function Home() {
  const { hackathons } = useHackathonStore();
  const { teams } = useTeamStore();

  const ongoingHackathons = hackathons.filter(h => h.status === 'ongoing');
  const totalParticipants = hackathons.reduce((sum, h) => sum + h.participantCount, 0);
  const totalTeams = teams.length;
  const openTeamsCount = teams.filter(t => t.isOpen).length;

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
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <StatCard label="진행 중 대회" value={ongoingHackathons.length} />
            <StatCard label="총 참가자" value={totalParticipants.toLocaleString()} />
            <StatCard label="등록된 팀" value={totalTeams} />
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 lg:py-24 bg-muted/20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">빠른 시작</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <QuickAccessCard
              icon={Trophy}
              title="해커톤"
              description="진행중인 대회에 참가하고 실력을 겨루세요."
              link="/hackathons"
              linkText={`${hackathons.length}개 대회 보기`}
            />
            <QuickAccessCard
              icon={Users}
              title="팀 찾기"
              description="함께 할 팀원을 찾거나 새로운 팀을 만드세요."
              link="/camp"
              linkText={`${openTeamsCount}개 팀 모집중`}
            />
            <QuickAccessCard
              icon={BarChart3}
              title="랭킹"
              description="글로벌 랭킹에서 나의 위치를 확인하세요."
              link="/rankings"
              linkText="Top 10 보기"
            />
          </div>
        </div>
      </section>
      
      {/* Ongoing Hackathons Section */}
      <section className="py-16 lg:py-24 bg-background">
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
              {ongoingHackathons.slice(0,3).map(hackathon => (
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
