'use client';

import React, { useMemo } from 'react';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useUserStore } from '@/store/useUserStore';
import { useRankingStore } from '@/store/useRankingStore';
import { getHackathonPhase } from '@/lib/hackathon-utils';
import type { HackathonDetail, Leaderboard, Submission } from '@/types';
import SubmissionGallery from './SubmissionGallery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, TrendingUp, Vote, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type GallerySectionProps = {
  leaderboard: Leaderboard;
  hackathonDetail: HackathonDetail;
  submissions: Submission[];
};

export default function GallerySection({ leaderboard, hackathonDetail, submissions }: GallerySectionProps) {
  const { teams } = useTeamStore();
  const { currentUser, votedTeamsByHackathon, addVotedTeam, addPointHistory } = useUserStore();
  const { votes, incrementVote } = useHackathonStore();
  const { recalculateRankings } = useRankingStore();
  const { toast } = useToast();

  const votedTeams = currentUser && votedTeamsByHackathon[hackathonDetail.slug] ? votedTeamsByHackathon[hackathonDetail.slug] : [];
  const remainingVotes = 3 - votedTeams.length;

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
    }).filter(e => e.submittedAt); // 제출물이 있는 팀만 표시
  }, [teams, leaderboard, submissions, hackathonDetail, currentUser, hackathonVotes]);

  const handleVote = (teamCode: string) => {
    if (!currentUser) {
      toast({
        title: "로그인이 필요합니다",
        description: "작품 투표는 대회 참가자만 가능합니다.",
        variant: "destructive"
      });
      return;
    }

    const team = unifiedEntries.find(e => e.teamCode === teamCode);
    if (!team) return;

    if (votedTeams.includes(team.name)) {
      toast({
        title: "투표 실패",
        description: "이미 이 팀에 투표하셨습니다.",
        variant: "destructive"
      });
      return;
    }

    if (remainingVotes <= 0) {
      toast({
        title: "투표 횟수 초과",
        description: "이 해커톤에서 사용할 수 있는 투표권 3장을 모두 소진했습니다.",
        variant: "destructive"
      });
      return;
    }

    const success = addVotedTeam(hackathonDetail.slug, team.name);
    if (success) {
      incrementVote(hackathonDetail.slug, team.name);
      addPointHistory(`'${team.name}' 팀 작품 투표`, 5);
      recalculateRankings();
      toast({
        title: "투표 완료! 🎉",
        description: "글로벌 랭킹 포인트 +5점이 지급되었습니다.",
      });
    }
  };

  const targetItemKey = useMemo(() => {
    const items = hackathonDetail.sections.submit.submissionItems || [];
    const target = items.find(item => item.isGalleryTarget);
    return target?.key;
  }, [hackathonDetail]);

  // 🌟 다이나믹 갤러리 오픈 날짜 계산 (투표 시작일 찾기)
  const galleryOpenDate = useMemo(() => {
    const milestones = hackathonDetail.sections.schedule.milestones || [];
    const votingMilestone = milestones.find(m => m.type === 'voting' || m.galleryEnabled === true);
    return votingMilestone ? new Date(votingMilestone.at) : null;
  }, [hackathonDetail]);

  const daysUntilOpen = galleryOpenDate
    ? Math.ceil((galleryOpenDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // 🌟 제출 기간 (블라인드 모드)
  if (!currentPhase.galleryEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-800/50 blur-3xl rounded-full" />
          <div className="relative p-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Lock className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              공정한 평가를 위해 갤러리 비공개 중
            </h3>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
              아이디어 도용 및 표절을 방지하기 위해 제출 마감 전까지 다른 팀의 결과물은 블라인드 처리됩니다.<br />
              <br />
              {galleryOpenDate && (
                <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg">
                  {galleryOpenDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              에 모든 팀의 작품이 동시에 공개됩니다!
            </p>
          </div>
        </div>

        {galleryOpenDate && daysUntilOpen > 0 && (
          <div className="bg-indigo-600/10 dark:bg-indigo-500/10 px-6 py-3 rounded-full border border-indigo-200 dark:border-indigo-500/20">
            <p className="text-indigo-700 dark:text-indigo-300 font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              갤러리 오픈까지 D-{daysUntilOpen}
            </p>
          </div>
        )}
      </div>
    );
  }

  // 🌟 투표 및 결과 확인 (오픈 모드)
  return (
    <div className="space-y-8">
      <Card className="border-indigo-100 dark:border-indigo-900/30 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-slate-900 shadow-sm">
        <CardHeader className="pb-3 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
              <Vote className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">작품 전시 및 투표</CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className={isVotingPhase ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"}>
              {isVotingPhase ? "🗳️ 실시간 투표 진행 중" : "👀 대회 종료 (작품 열람)"}
            </Badge>
            <span className="text-sm text-muted-foreground font-medium">총 {unifiedEntries.length}개의 작품이 전시 중입니다</span>
            {isVotingPhase && currentUser && (
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 ml-1 font-bold tracking-tight">
                내 남은 투표권: {remainingVotes}/3
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
            {isVotingPhase
              ? "마음에 드는 프로젝트에 투표해 주세요! (최대 3팀)\n작품에 투표할 때마다 글로벌 커뮤니티 포인트 +5점이 즉시 지급됩니다."
              : "투표가 모두 마감되었습니다. 참가자들의 뛰어난 작품들을 자유롭게 감상하실 수 있습니다."}
          </p>
        </CardContent>
      </Card>

      <SubmissionGallery
        entries={unifiedEntries}
        isVotingPhase={isVotingPhase}
        onVote={handleVote}
        targetItemKey={targetItemKey}
      />

      <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-start gap-4">
        <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">투표 안내</p>
          <ul className="text-[11px] text-muted-foreground space-y-1 leading-relaxed list-disc pl-3">
            <li>각 대회당 최대 3개의 팀에만 투표할 수 있으며 투표를 취소할 수 없습니다.</li>
            <li>투표 시마다 5점의 글로벌 랭킹 포인트가 부여됩니다.</li>
            <li>자신이 속한 팀에는 투표할 수 없습니다.</li>
            <li>투표 결과는 실시간 리더보드 점수에 자동으로 반영됩니다.</li>
            <li>부정한 방법을 통한 투표는 무효 처리될 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}