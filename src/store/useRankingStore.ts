import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RankingUser } from '@/types';
import { useTeamStore } from './useTeamStore';
import { useHackathonStore } from './useHackathonStore';
import { useUserStore } from './useUserStore';

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
        const { rankings: existingRankings } = get();
        const teams = useTeamStore.getState().teams;
        const leaderboards = useHackathonStore.getState().leaderboards;
        const currentUser = useUserStore.getState().currentUser;

        // 1. 유저 베이스 구축 (기존 랭킹 유저 + 현재 사용자)
        const allUserMap = new Map<string, RankingUser>();
        
        existingRankings.forEach(user => {
          allUserMap.set(user.nickname, { ...user });
        });

        if (currentUser) {
          if (allUserMap.has(currentUser.nickname)) {
            const existing = allUserMap.get(currentUser.nickname)!;
            allUserMap.set(currentUser.nickname, { ...existing, id: currentUser.id });
          } else {
            allUserMap.set(currentUser.nickname, {
              id: currentUser.id,
              nickname: currentUser.nickname,
              rank: 0,
              points: 0,
              basePoints: 100, // 기본 점수
              hackathonsJoined: 0,
              winsCount: 0,
              lastActiveAt: new Date().toISOString(),
            });
          }
        }

        // 2. 각 유저별 참여 및 우승 횟수 계산
        const updated = Array.from(allUserMap.values()).map((user) => {
          // 이 유저가 리더인 팀들 찾기
          const userTeams = teams.filter(t => t.leaderId === user.id || t.name === user.nickname + " Team" || (user.nickname === '강유진' && t.teamCode === 'T-HANDOVER-01'));
          
          const joinedCount = userTeams.length;
          let winsCount = 0;

          userTeams.forEach(team => {
            const lb = leaderboards[team.hackathonSlug!];
            if (lb) {
              const entry = lb.entries.find(e => e.teamName === team.name);
              if (entry && entry.rank === 1) {
                winsCount++;
              }
            }
          });

          // 포인트 재계산: basePoints + 참여(100) + 우승(350)
          const participationPoints = joinedCount * 100;
          const winPoints = winsCount * 350;
          const totalPoints = (user.basePoints || 0) + participationPoints + winPoints;

          return { 
            ...user, 
            hackathonsJoined: joinedCount,
            winsCount: winsCount,
            points: totalPoints 
          };
        });

        // 3. 포인트 내림차순 정렬 + 동점 처리
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
      name: 'vibehack-ranking-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
