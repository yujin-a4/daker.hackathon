'use client';

import React, { useMemo } from 'react';
import { Info, Lock, Vote } from 'lucide-react';

import type { HackathonDetail, Submission } from '@/types';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useRankingStore } from '@/store/useRankingStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/hooks/use-toast';
import { getHackathonPhase } from '@/lib/hackathon-utils';

import SubmissionGallery from './SubmissionGallery';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type GallerySectionProps = {
  hackathonDetail: HackathonDetail;
  submissions: Submission[];
};

export default function GallerySection({ hackathonDetail, submissions }: GallerySectionProps) {
  const { teams } = useTeamStore();
  const { currentUser, votedTeamsByHackathon, addPointHistory, addVotedTeam } = useUserStore();
  const { incrementVote, votes } = useHackathonStore();
  const { recalculateRankings } = useRankingStore();
  const { toast } = useToast();

  const currentPhase = useMemo(() => getHackathonPhase(hackathonDetail), [hackathonDetail]);
  const isVotingPhase = currentPhase.votingEnabled;
  const targetItemKey = useMemo(() => {
    return hackathonDetail.sections.submit.submissionItems?.find((item) => item.isGalleryTarget)?.key;
  }, [hackathonDetail]);

  const votedTeams = currentUser ? votedTeamsByHackathon[hackathonDetail.slug] || [] : [];
  const remainingVotes = 3 - votedTeams.length;
  const voteState = votes[hackathonDetail.slug] || {};

  const galleryEntries = useMemo(() => {
    return teams
      .filter((team) => team.hackathonSlug === hackathonDetail.slug)
      .map((team) => {
        const submission = submissions.find((item) => item.teamCode === team.teamCode);
        const artifacts = (submission?.artifacts || []).filter((artifact) =>
          targetItemKey ? artifact.key === targetItemKey : true
        );
        return {
          teamCode: team.teamCode,
          name: team.name,
          isSolo: !!team.isSolo,
          votes: isVotingPhase ? (voteState[team.name] || 0) : 0,
          submittedAt: submission?.submittedAt ?? null,
          artifacts: artifacts.map((artifact) => ({ ...artifact, key: artifact.key || 'unknown' })),
          isMyTeam: currentUser?.teamCodes.includes(team.teamCode) ?? false,
        };
      })
      .filter((entry) => entry.submittedAt && entry.artifacts.length > 0);
  }, [teams, hackathonDetail.slug, submissions, targetItemKey, voteState, currentUser, isVotingPhase]);

  const galleryOpenDate = useMemo(() => {
    const milestone = hackathonDetail.sections.schedule.milestones.find(
      (item) => item.type === 'voting' || item.galleryEnabled === true
    );
    return milestone ? new Date(milestone.at) : null;
  }, [hackathonDetail]);

  if (currentPhase.type === 'PREPARATION') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-8">
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-0 bg-indigo-200/30 dark:bg-indigo-800/20 blur-3xl rounded-full" />
          <div className="relative p-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Lock className="w-10 h-10 text-indigo-400 dark:text-indigo-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              아직 대회가 시작되지 않았습니다.
            </h3>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
              대회가 시작되면 작품 전시와 투표 기능이 자동으로 열립니다.
              {currentPhase.endDate && (
                <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg mt-3 inline-block">
                  시작 예정: {currentPhase.endDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPhase.galleryEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-8">
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-800/50 blur-3xl rounded-full" />
          <div className="relative p-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Lock className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              갤러리는 아직 열리지 않았습니다.
            </h3>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
              제출 마감 후 공개됩니다.
              {galleryOpenDate && (
                <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg mt-3 inline-block">
                  공개 예정: {galleryOpenDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleVote = (teamCode: string) => {
    if (!currentUser) {
      toast({
        title: '로그인이 필요합니다.',
        description: '투표는 로그인한 사용자만 할 수 있습니다.',
        variant: 'destructive',
      });
      return;
    }

    const target = galleryEntries.find((entry) => entry.teamCode === teamCode);
    if (!target || target.isMyTeam) {
      return;
    }

    if (votedTeams.includes(target.name)) {
      toast({
        title: '이미 투표했습니다.',
        description: '같은 팀에는 한 번만 투표할 수 있습니다.',
        variant: 'destructive',
      });
      return;
    }

    if (remainingVotes <= 0) {
      toast({
        title: '투표 한도를 모두 사용했습니다.',
        description: '한 해커톤당 최대 3팀까지 투표할 수 있습니다.',
        variant: 'destructive',
      });
      return;
    }

    if (addVotedTeam(hackathonDetail.slug, target.name)) {
      incrementVote(hackathonDetail.slug, target.name);
      addPointHistory(`'${target.name}' 팀 작품 투표`, 5);
      recalculateRankings();
      toast({
        title: '투표가 반영되었습니다.',
        description: '랭킹과 포인트에 바로 반영됩니다.',
      });
    }
  };

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
            <Badge variant="outline" className={isVotingPhase ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}>
              {isVotingPhase ? '실시간 투표 진행 중' : '투표 종료, 작품 열람 가능'}
            </Badge>
            <span className="text-sm text-muted-foreground font-medium">총 {galleryEntries.length}개 작품이 전시 중입니다</span>
            {isVotingPhase && currentUser && (
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 ml-1 font-bold tracking-tight">
                남은 투표권 {remainingVotes}/3
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
            {isVotingPhase
              ? '마음에 드는 프로젝트에 투표해 주세요. 최대 3팀까지 투표할 수 있습니다.'
              : '투표는 마감되었고, 지금은 제출된 작품을 자유롭게 살펴볼 수 있습니다.'}
          </p>
        </CardContent>
      </Card>

      <SubmissionGallery
        entries={galleryEntries}
        isVotingPhase={isVotingPhase}
        onVote={handleVote}
        targetItemKey={targetItemKey}
      />

      <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-start gap-4">
        <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">투표 안내</p>
          <ul className="text-[11px] text-muted-foreground space-y-1 leading-relaxed list-disc pl-3">
            <li>한 사용자당 최대 3팀까지 투표할 수 있습니다.</li>
            <li>자신이 속한 팀에는 투표할 수 없습니다.</li>
            <li>투표 결과는 리더보드와 랭킹 계산에 즉시 반영됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
