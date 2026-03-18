import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RankingUser } from '@/types';

interface RankingState {
  rankings: RankingUser[];
}

export const useRankingStore = create<RankingState>()(
  persist(
    (set) => ({
      rankings: [],
    }),
    {
      name: 'vibehack-ranking-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
