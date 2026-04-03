import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Hackathon, HackathonDetail, Leaderboard, LeaderboardEntry } from '@/types';

interface HackathonState {
  hackathons: Hackathon[];
  hackathonDetails: Record<string, HackathonDetail>;
  leaderboards: Record<string, Leaderboard>;
  votes: Record<string, Record<string, number>>;

  addLeaderboardEntry: (hackathonSlug: string, entry: LeaderboardEntry) => void;
  updateLeaderboardEntryTimestamp: (hackathonSlug: string, teamName: string, submittedAt: string | null) => void;
  incrementVote: (hackathonSlug: string, teamName: string) => void;

  // 🌟 [이 줄이 있어야 에러가 안 나!] AI 자동 채점 반영 함수
  updateAutoScore: (hackathonSlug: string, teamName: string, score: number) => void;
}

export const useHackathonStore = create<HackathonState>()(
  persist(
    (set, get) => ({
      hackathons: [],
      hackathonDetails: {},
      leaderboards: {},
      votes: {},

      incrementVote: (hackathonSlug, teamName) => {
        set((state) => {
          const hackathonVotes = state.votes[hackathonSlug] || {};
          const currentVotes = hackathonVotes[teamName] || 0;
          return {
            votes: {
              ...state.votes,
              [hackathonSlug]: {
                ...hackathonVotes,
                [teamName]: currentVotes + 1,
              },
            },
          };
        });
      },

      addLeaderboardEntry: (hackathonSlug, entry) => {
        set((state) => {
          const lb = state.leaderboards[hackathonSlug];
          if (!lb) {
            return {
              leaderboards: {
                ...state.leaderboards,
                [hackathonSlug]: { updatedAt: new Date().toISOString(), entries: [entry] },
              },
            };
          }
          const exists = lb.entries.some((e) => e.teamName === entry.teamName);
          if (exists) return state;
          return {
            leaderboards: {
              ...state.leaderboards,
              [hackathonSlug]: { ...lb, updatedAt: new Date().toISOString(), entries: [...lb.entries, entry] },
            },
          };
        });
      },

      updateLeaderboardEntryTimestamp: (hackathonSlug, teamName, submittedAt) => {
        set((state) => {
          const lb = state.leaderboards[hackathonSlug];
          if (!lb) return state;

          let entries: LeaderboardEntry[] = lb.entries.map((e) => {
            if (e.teamName !== teamName) return e;
            if (submittedAt === null) return { ...e, submittedAt: null, score: null, rank: null };
            return { ...e, submittedAt };
          });

          const scored = entries.filter((e) => e.score !== null).map((e) => ({ ...e }));
          scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

          let currentRank = 1;
          for (let i = 0; i < scored.length; i++) {
            if (i > 0 && scored[i].score === scored[i - 1].score) {
              scored[i].rank = scored[i - 1].rank;
            } else {
              scored[i].rank = currentRank;
            }
            currentRank = i + 2;
          }

          const unscored = entries.filter((e) => e.score === null).map((e) => ({ ...e, rank: null }));

          return {
            leaderboards: {
              ...state.leaderboards,
              [hackathonSlug]: { ...lb, updatedAt: new Date().toISOString(), entries: [...scored, ...unscored] },
            },
          };
        });
      },

      // 🌟 [이 구현부가 있어야 에러가 안 나!] AI 자동 채점 반영 로직
      updateAutoScore: (hackathonSlug, teamName, score) => {
        set((state) => {
          const lb = state.leaderboards[hackathonSlug];
          if (!lb) return state;

          let entries = lb.entries.map((e) =>
            e.teamName === teamName ? { ...e, score } : e
          );

          const scored = entries.filter((e) => e.score !== null).map((e) => ({ ...e }));
          scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

          let currentRank = 1;
          for (let i = 0; i < scored.length; i++) {
            if (i > 0 && scored[i].score === scored[i - 1].score) {
              scored[i].rank = scored[i - 1].rank;
            } else {
              scored[i].rank = currentRank;
            }
            currentRank = i + 2;
          }

          const unscored = entries.filter((e) => e.score === null).map((e) => ({ ...e, rank: null }));

          return {
            leaderboards: {
              ...state.leaderboards,
              [hackathonSlug]: { ...lb, updatedAt: new Date().toISOString(), entries: [...scored, ...unscored] },
            },
          };
        });
      },
    }),
    {
      name: 'vibehack-hackathon-storage-v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
);