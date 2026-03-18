import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Hackathon, HackathonDetail, Leaderboard, LeaderboardEntry } from '@/types';

interface HackathonState {
  hackathons: Hackathon[];
  hackathonDetails: Record<string, HackathonDetail>;
  leaderboards: Record<string, Leaderboard>;
  addLeaderboardEntry: (hackathonSlug: string, entry: LeaderboardEntry) => void;
  updateLeaderboardEntryTimestamp: (hackathonSlug: string, teamName: string, submittedAt: string | null) => void;
}

export const useHackathonStore = create<HackathonState>()(
  persist(
    (set, get) => ({
      hackathons: [],
      hackathonDetails: {},
      leaderboards: {},
      addLeaderboardEntry: (hackathonSlug, entry) => {
        set(state => {
          const leaderboards = state.leaderboards;
          const targetLeaderboard = leaderboards[hackathonSlug];
          if (targetLeaderboard) {
            // Prevent duplicate entries
            if (targetLeaderboard.entries.some(e => e.teamName === entry.teamName)) {
              return state;
            }
            const updatedEntries = [...targetLeaderboard.entries, entry];
            const updatedLeaderboard = {
              ...targetLeaderboard,
              entries: updatedEntries,
              updatedAt: new Date().toISOString(),
            };
            return {
              leaderboards: {
                ...leaderboards,
                [hackathonSlug]: updatedLeaderboard,
              },
            };
          }
          return state;
        });
      },
      updateLeaderboardEntryTimestamp: (hackathonSlug, teamName, submittedAt) => {
        set(state => {
          const leaderboard = state.leaderboards[hackathonSlug];
          if (!leaderboard) return state;
          
          const entryIndex = leaderboard.entries.findIndex(e => e.teamName === teamName);
          if (entryIndex === -1 && submittedAt) {
            // New entry
            const newEntry: LeaderboardEntry = { rank: null, teamName, score: null, submittedAt };
            const newEntries = [...leaderboard.entries, newEntry];
            return {
                ...state,
                leaderboards: { ...state.leaderboards, [hackathonSlug]: { ...leaderboard, entries: newEntries, updatedAt: new Date().toISOString() } }
            };
          }

          if(entryIndex === -1) return state;

          const updatedEntries = [...leaderboard.entries];
          const entry = updatedEntries[entryIndex];
          entry.submittedAt = submittedAt;

          if (submittedAt === null) {
            entry.score = null;
            entry.rank = null;
          }

          // Re-rank based on score
          const rankedPortion = updatedEntries
            .filter(e => e.score !== null)
            .sort((a, b) => (b.score!) - (a.score!));
          
          rankedPortion.forEach((e, i) => { e.rank = i + 1; });

          const unrankedPortion = updatedEntries.filter(e => e.score === null);
          
          return {
            ...state,
            leaderboards: {
              ...state.leaderboards,
              [hackathonSlug]: {
                ...leaderboard,
                entries: [...rankedPortion, ...unrankedPortion],
                updatedAt: new Date().toISOString()
              }
            }
          };
        });
      }
    }),
    {
      name: 'vibehack-hackathon-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
