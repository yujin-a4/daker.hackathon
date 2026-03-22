import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RankingUser } from '@/types';

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
        const { rankings } = get();
        if (!rankings.length) return;

        // 포인트 재계산: basePoints + 참여 보너스 + 우승 보너스
        const updated = rankings.map((user) => {
          const participationPoints = (user.hackathonsJoined || 0) * 100;
          const winPoints = (user.winsCount || 0) * 350;
          const totalPoints = (user.basePoints || 0) + participationPoints + winPoints;

          return { ...user, points: totalPoints };
        });

        // 포인트 내림차순 정렬 + 동점 처리
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
