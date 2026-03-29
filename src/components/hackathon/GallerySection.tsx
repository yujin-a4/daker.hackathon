'use client';

import React, { useMemo } from 'react';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useUserStore } from '@/store/useUserStore';
import { getHackathonPhase } from '@/lib/hackathon-utils';
import type { HackathonDetail, Leaderboard, Submission } from '@/types';
import SubmissionGallery from './SubmissionGallery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, TrendingUp, Vote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type GallerySectionProps = {
  leaderboard: Leaderboard;
  hackathonDetail: HackathonDetail;
  submissions: Submission[];
};

export default function GallerySection({ leaderboard, hackathonDetail, submissions }: GallerySectionProps) {
  const { teams } = useTeamStore();
  const { currentUser } = useUserStore();
  const { votes, incrementVote } = useHackathonStore();

  const currentPhase = useMemo(() => getHackathonPhase(hackathonDetail), [hackathonDetail]);
  const isVotingPhase = currentPhase.votingEnabled;

  const hackathonVotes = votes[hackathonDetail.slug] || {};

  const unifiedEntries = useMemo(() => {
    const hackathonTeams = teams.filter(t => t.hackathonSlug === hackathonDetail.slug);
    
    return hackathonTeams.map(team => {
      const entryInLeaderboard = (leaderboard?.entries || []).find(e => e.teamName === team.name);
      const submissionByTeam = submissions.find(s => s.teamCode === team.teamCode);
      const isMyTeam = currentUser?.teamCodes.includes(team.teamCode) ?? false;

      return {
        teamCode: team.teamCode,
        name: team.name,
        isSolo: !!team.isSolo,
        votes: (entryInLeaderboard?.votes ?? 0) + (hackathonVotes[team.name] || 0),
        submittedAt: submissionByTeam?.submittedAt ?? entryInLeaderboard?.submittedAt ?? null,
        artifacts: (submissionByTeam?.artifacts || []).map(a => ({
          ...a,
          key: a.key || 'unknown'
        })),
        isMyTeam,
      };
    }).filter(e => e.submittedAt); // Only show teams that submitted something
  }, [teams, leaderboard, submissions, hackathonDetail, currentUser, hackathonVotes]);

  const handleVote = (teamCode: string) => {
    const team = unifiedEntries.find(e => e.teamCode === teamCode);
    if (team) {
      incrementVote(hackathonDetail.slug, team.name);
    }
  };

  if (!currentPhase.galleryEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="relative p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl">
            <TrendingUp className="w-16 h-16 text-indigo-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">갤러리 공개 예정</h3>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
              현재는 공정한 경쟁을 위해 기획안을 비공개로 유지 중입니다.<br/>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">3월 30일 10:00</span>에 모든 팀의 반짝이는 기획서가 동시에 공개됩니다!
            </p>
          </div>
        </div>
        
        <div className="bg-indigo-600/5 dark:bg-indigo-500/5 px-6 py-3 rounded-full border border-indigo-100 dark:border-indigo-500/20">
          <p className="text-indigo-600 dark:text-indigo-400 font-black text-sm uppercase tracking-widest">
            Coming Soon • Revealing in {Math.ceil((new Date('2026-03-30T10:00:00+09:00').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 갤러리 헤더 안내 */}
      <Card className="border-indigo-100 dark:border-indigo-900/30 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-slate-900 shadow-sm">
        <CardHeader className="pb-3 text-center">
          <div className="flex justify-center mb-2">
             <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
               <Vote className="w-8 h-8 text-white" />
             </div>
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">작품 전시 및 투표</CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className="bg-white/80 dark:bg-slate-800 border-indigo-200">
               {isVotingPhase ? "🗳️ 투표 진행 중" : "👀 지난 작품 보기"}
            </Badge>
            <span className="text-sm text-muted-foreground font-medium">총 {unifiedEntries.length}개의 작품이 전시 중입니다</span>
          </div>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {isVotingPhase 
              ? "마음에 드는 프로젝트에 투표해 주세요! 여러분의 투표가 실시간으로 순위에 반영되어 대회의 주인공을 결정합니다."
              : "현재는 투표 기간이 아니지만, 참가자들의 뛰어난 작품들을 자유롭게 감상하실 수 있습니다."}
          </p>
        </CardContent>
      </Card>

      {/* 갤러리 그리드 */}
      <SubmissionGallery 
        entries={unifiedEntries} 
        isVotingPhase={isVotingPhase} 
        onVote={handleVote} 
      />

      {/* 안내사항 */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-start gap-4">
        <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">투표 안내</p>
          <ul className="text-[11px] text-muted-foreground space-y-1 leading-relaxed list-disc pl-3">
            <li>자신이 속한 팀에는 투표할 수 없습니다.</li>
            <li>투표 결과는 실시간 리더보드 점수에 자동으로 반영됩니다.</li>
            <li>부정한 방법을 통한 투표는 무효 처리될 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
