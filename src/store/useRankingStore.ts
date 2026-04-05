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
        const allUsers = useUserStore.getState().allUsers;
        const currentUser = useUserStore.getState().currentUser;
        const teams = useTeamStore.getState().teams;
        const leaderboards = useHackathonStore.getState().leaderboards;
        const hackathonDetails = useHackathonStore.getState().hackathonDetails;
        const allVotes = useHackathonStore.getState().votes;
        const submissions = useSubmissionStore.getState().submissions;

        const userList = [...allUsers];
        if (currentUser && !userList.find((user) => user.id === currentUser.id)) {
          userList.push(currentUser);
        }

        const updated: RankingUser[] = userList.map((user) => {
          const leaderTeams = teams.filter((team) => team.leaderId === user.id);
          const joinedTeams =
            currentUser && user.id === currentUser.id
              ? teams.filter((team) => currentUser.teamCodes.includes(team.teamCode) && team.leaderId !== user.id)
              : [];

          const allMyTeams = [...leaderTeams, ...joinedTeams];
          const joinedCount = allMyTeams.length;
          let winsCount = 0;
          let competitivePoints = 0;
          let submissionPoints = 0;

          allMyTeams.forEach((team) => {
            const slug = team.hackathonSlug;
            if (!slug) return;

            const detail = hackathonDetails[slug];
            if (!detail) return;

            const hackathonTeams = teams.filter((item) => item.hackathonSlug === slug);
            const hackathonLeaderboard = leaderboards[slug]?.entries || [];
            const hackathonVotes = allVotes[slug] || {};
            const phase = getHackathonPhase(detail);

            const standings = calculateCompetitionStandings(
              phase,
              hackathonTeams,
              submissions,
              hackathonVotes,
              hackathonLeaderboard,
              team.teamCode
            );

            const myEntry = standings.find((entry) => entry.teamCode === team.teamCode);
            const leaderboardEntry = hackathonLeaderboard.find((entry) => entry.teamName === team.name);
            const effectiveRank = myEntry?.rank ?? leaderboardEntry?.rank ?? null;

            if (effectiveRank === 1) {
              winsCount += 1;
              competitivePoints += 500;
            } else if (effectiveRank === 2) {
              competitivePoints += 400;
            } else if (effectiveRank === 3) {
              competitivePoints += 300;
            }

            const submission = submissions.find((item) => item.teamCode === team.teamCode);
            if (submission?.artifacts) {
              submissionPoints += submission.artifacts.length * 100;
            }
          });

          const effectivePointHistory =
            currentUser && user.id === currentUser.id
              ? currentUser.pointHistory || user.pointHistory || []
              : user.pointHistory || [];
          const historyPoints = effectivePointHistory.reduce((acc, log) => acc + log.points, 0);

          const participationPoints = joinedCount * 50;
          const totalPoints =
            (user.basePoints || 0) + historyPoints + participationPoints + competitivePoints + submissionPoints;

          return {
            id: user.id || `anon-${user.nickname}`,
            rank: 0,
            nickname: user.nickname,
            points: totalPoints,
            basePoints: user.basePoints ?? 0,
            hackathonsJoined: joinedCount,
            winsCount,
            lastActiveAt: user.joinedAt || new Date().toISOString(),
          };
        });

        updated.sort((a, b) => b.points - a.points);

        let currentRank = 1;
        for (let index = 0; index < updated.length; index += 1) {
          if (index > 0 && updated[index].points === updated[index - 1].points) {
            updated[index] = { ...updated[index], rank: updated[index - 1].rank };
          } else {
            updated[index] = { ...updated[index], rank: currentRank };
          }
          currentRank = index + 2;
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
