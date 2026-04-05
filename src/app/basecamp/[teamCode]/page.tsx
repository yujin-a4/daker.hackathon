'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { ArrowLeft, BookOpen, StickyNote, Activity, Target } from 'lucide-react';
import { getTeamComposition } from '@/lib/teamComposition';
import { getHackathonStatusLabel } from '@/lib/hackathon-utils';
import { isTeamRecruiting } from '@/lib/team-recruiting';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BasecampInfoTab from '@/components/camp/tabs/BasecampInfoTab';
import BasecampWarroomTab from '@/components/camp/tabs/BasecampWarroomTab';
import BasecampBoardTab from '@/components/camp/tabs/BasecampBoardTab';

type TabId = 'info' | 'warroom' | 'board';

const TABS = [
  { id: 'info' as TabId, label: '정보', icon: BookOpen },
  { id: 'warroom' as TabId, label: '작전실', icon: Target },
  { id: 'board' as TabId, label: '게시판', icon: StickyNote },
];

export default function BasecampPage() {
  const router = useRouter();
  const params = useParams();
  const teamCode = params.teamCode as string;

  const { currentUser, allUsers } = useUserStore();
  const { teams } = useTeamStore();
  const { hackathons } = useHackathonStore();

  const [activeTab, setActiveTab] = useState<TabId>('info');

  const team = teams.find((t) => t.teamCode === teamCode);
  const isMember = currentUser && currentUser.teamCodes.includes(teamCode);
  const hackathon = team ? hackathons.find((h) => h.slug === team.hackathonSlug) : null;
  const isRecruiting = team ? isTeamRecruiting(team, hackathon) : false;
  const composition = team ? getTeamComposition(team, allUsers, currentUser) : null;

  useEffect(() => {
    if (!currentUser || !team || !isMember) {
      router.replace('/');
    }
  }, [currentUser, team, isMember, router]);

  if (!currentUser || !team || !isMember || !hackathon) return null;

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="bg-background border-b sticky top-14 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 h-5 px-1.5 text-[10px] font-bold uppercase tracking-wider">
                  Basecamp
                </Badge>
                <h1 className="text-base font-black tracking-tight">{team.name}</h1>
              </div>
              <div className="hidden md:block w-px h-3 bg-slate-200 dark:bg-slate-800" />
              <p className="text-[11px] font-medium text-muted-foreground truncate max-w-[200px] md:max-w-md">
                {hackathon.title}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push(`/hackathons/${hackathon.slug}`)} className="text-xs font-bold text-primary group">
            대회 상세 <ArrowLeft className="ml-1 h-3.5 w-3.5 rotate-180 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-56 shrink-0 flex flex-col gap-4">
          <nav className="bg-background rounded-xl border p-2 flex md:flex-col gap-1 overflow-x-auto snap-x">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors snap-center whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 pointer-events-none'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'opacity-70'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="bg-background rounded-xl border p-5 hidden md:block">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-1.5 min-w-0">
              <Activity className="w-4 h-4 text-primary shrink-0" />
              팀 현황
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">팀원</span>
                <span className="font-semibold">{composition?.confirmedMemberCount ?? team.memberCount} / {team.maxTeamSize}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">대회 상태</span>
                <span className={hackathon.status !== 'ended' ? 'text-blue-600 font-semibold' : ''}>
                  {getHackathonStatusLabel(hackathon.status)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">팀 모집</span>
                <Badge variant={isRecruiting ? 'default' : 'secondary'} className="text-[10px] px-1.5">
                  {isRecruiting ? '모집중' : '마감'}
                </Badge>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="bg-background rounded-xl border p-4 md:p-6 lg:p-8 min-h-[600px] shadow-sm">
            {activeTab === 'info' && <BasecampInfoTab team={team} hackathon={hackathon} />}
            {activeTab === 'warroom' && <BasecampWarroomTab team={team} hackathon={hackathon} />}
            {activeTab === 'board' && <BasecampBoardTab team={team} />}
          </div>
        </main>
      </div>
    </div>
  );
}
