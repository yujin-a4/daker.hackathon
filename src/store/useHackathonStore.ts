import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Hackathon, HackathonDetail, Leaderboard, LeaderboardEntry } from '@/types';

interface HackathonState {
  hackathons: Hackathon[];
  hackathonDetails: Record<string, HackathonDetail>;
  leaderboards: Record<string, Leaderboard>;
  addLeaderboardEntry: (hackathonSlug: string, entry: LeaderboardEntry) => void;
}

export const useHackathonStore = create<HackathonState>()(
  persist(
    (set, get) => ({
      hackathons: [],
      hackathonDetails: {},
      leaderboards: {},
      addLeaderboardEntry: (hackathonSlug, entry) => {
        const { leaderboards } = get();
        const targetLeaderboard = leaderboards[hackathonSlug];
        if (targetLeaderboard) {
          const updatedEntries = [...targetLeaderboard.entries, entry];
          const updatedLeaderboard = {
            ...targetLeaderboard,
            entries: updatedEntries,
            updatedAt: new Date().toISOString(),
          };
          set({
            leaderboards: {
              ...leaderboards,
              [hackathonSlug]: updatedLeaderboard,
            },
          });
        }
      },
    }),
    {
      name: 'vibehack-hackathon-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
