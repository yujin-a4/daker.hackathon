import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RankingUser } from '@/types';
import { useTeamStore } from './useTeamStore';
import { useHackathonStore } from './useHackathonStore';
import { useUserStore } from './useUserStore';
import { useSubmissionStore } from './useSubmissionStore';
import { getHackathonPhase, calculateCompetitionStandings } from '@/lib/hackathon-utils';

interface RankingState {
  rankings: RankingUser[];
  recalculateRankings: () => void;
  getRankingsByPeriod: (period: 'all' | '30d' | '7d') => RankingUser[];
}

export const useRankingStore = create<RankingState>()(
  persist(
    (set, get) => ({
      rankings: [],

      recalculateRankings: () => {
        // ──────────────────────────────────────────────────────────────
        // 단일 진실 공급원:
        //  allUsers (personaPool + 로그인 유저들)
        //  → 각 유저의 leaderId와 매칭되는 팀 역추적
        //  → 해당 팀의 리더보드 성적 + 제출물로 포인트 산출
        // ──────────────────────────────────────────────────────────────
        const allUsers = useUserStore.getState().allUsers;
        const currentUser = useUserStore.getState().currentUser;
        const teams = useTeamStore.getState().teams;
        const leaderboards = useHackathonStore.getState().leaderboards;
        const hcDetails = useHackathonStore.getState().hackathonDetails;
        const allVotes = useHackathonStore.getState().votes;
        const submissions = useSubmissionStore.getState().submissions;

        // 현재 로그인 유저가 allUsers에 없으면 추가
        const userList = [...allUsers];
        if (currentUser && !userList.find(u => u.id === currentUser.id)) {
          userList.push(currentUser);
        }

        const updated: RankingUser[] = userList.map((user) => {
          // 1. 이 유저가 리더인 팀 목록
          const userTeams = teams.filter(t => t.leaderId === user.id);

          // 2. 강유진(currentUser)은 teamCodes 기반으로도 팀을 추적
          const extraTeams =
            currentUser && user.id === currentUser.id
              ? teams.filter(
                  t =>
                    currentUser.teamCodes.includes(t.teamCode) &&
                    t.leaderId !== user.id
                )
              : [];
          const allMyTeams = [...userTeams, ...extraTeams];

          const joinedCount = allMyTeams.length;
          let winsCount = 0;
          let competitivePoints = 0;
          let submissionPoints = 0;

          allMyTeams.forEach(team => {
            const slug = team.hackathonSlug;
            if (!slug) return;
            const detail = hcDetails[slug];
            if (!detail) return;

            const hbTeams = teams.filter(t => t.hackathonSlug === slug);
            const hbLeaderboard = leaderboards[slug]?.entries || [];
            const hbVotes = allVotes[slug] || {};
            const phase = getHackathonPhase(detail);

            // 리더보드 기반 순위 계산 (team.name 으로 매칭)
            const standings = calculateCompetitionStandings(
              phase, hbTeams, submissions, hbVotes, hbLeaderboard, team.teamCode
            );

            const myEntry = standings.find(e => e.teamCode === team.teamCode);

            // 리더보드 직접 조회로 보조 (팀명 기반)
            const lbEntry = hbLeaderboard.find(e => e.teamName === team.name);

            const effectiveRank = myEntry?.rank ?? lbEntry?.rank ?? null;
            if (effectiveRank) {
              if (effectiveRank === 1) { winsCount++; competitivePoints += 500; }
              else if (effectiveRank === 2) { competitivePoints += 400; }
              else if (effectiveRank === 3) { competitivePoints += 300; }
            }

            // 제출물 단계별 100점
            const submission = submissions.find(s => s.teamCode === team.teamCode);
            if (submission?.artifacts) {
              submissionPoints += submission.artifacts.length * 100;
            }
          });

          // 3. 현재 로그인 유저의 pointHistory(투표/게시글 등 활동) 합산
          let historyPoints = 0;
          if (currentUser && user.id === currentUser.id && currentUser.pointHistory) {
            historyPoints = currentUser.pointHistory.reduce((acc, h) => acc + h.points, 0);
          }

          // 4. 포인트 합산
          const participationPoints = joinedCount * 50;
          const totalPoints =
            (user as any).basePoints
              // 기존 RankingUser는 basePoints 보유 가능
              ? ((user as any).basePoints as number) + historyPoints + participationPoints + competitivePoints + submissionPoints
              : historyPoints + participationPoints + competitivePoints + submissionPoints;

          return {
            id: user.id || `anon-${user.nickname}`,
            rank: 0,                          // 정렬 후 부여
            nickname: user.nickname,
            points: totalPoints,
            basePoints: (user as any).basePoints ?? 0,
            hackathonsJoined: joinedCount,
            winsCount,
            lastActiveAt: user.joinedAt || new Date().toISOString(),
          } as RankingUser;
        });

        // 5. 포인트 내림차순 정렬 + 동점 처리
        updated.sort((a, b) => b.points - a.points);

        let currentRank = 1;
        for (let i = 0; i < updated.length; i++) {
          if (i > 0 && updated[i].points === updated[i - 1].points) {
            updated[i] = { ...updated[i], rank: updated[i - 1].rank };
          } else {
            updated[i] = { ...updated[i], rank: currentRank };
          }
          currentRank = i + 2;
        }

        set({ rankings: updated });
      },

      getRankingsByPeriod: (period) => {
        const { rankings } = get();
        if (period === 'all') return rankings;

        const now = new Date();
        const cutoff = new Date();
        if (period === '30d') cutoff.setDate(now.getDate() - 30);
        if (period === '7d') cutoff.setDate(now.getDate() - 7);

        return rankings.filter((user) => {
          if (!user.lastActiveAt) return false;
          return new Date(user.lastActiveAt) >= cutoff;
        });
      },
    }),
    {
      name: 'vibehack-ranking-storage-v5',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
