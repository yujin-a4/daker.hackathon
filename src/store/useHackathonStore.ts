import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Hackathon,
  HackathonDetail,
  Leaderboard,
  LeaderboardEntry,
} from '@/types';

interface HackathonState {
  hackathons: Hackathon[];
  hackathonDetails: Record<string, HackathonDetail>;
  leaderboards: Record<string, Leaderboard>;
  votes: Record<string, Record<string, number>>; // { hackathonSlug: { teamName: votes } }

  // 리더보드 조작
  addLeaderboardEntry: (hackathonSlug: string, entry: LeaderboardEntry) => void;
  updateLeaderboardEntryTimestamp: (
    hackathonSlug: string,
    teamName: string,
    submittedAt: string | null
  ) => void;
  incrementVote: (hackathonSlug: string, teamName: string) => void;
}

export const useHackathonStore = create<HackathonState>()(
  persist(
    (set, get) => ({
      hackathons: [],
      hackathonDetails: {},
      leaderboards: {},
      votes: {},

      // ── 투표 처리 ──
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

      // ── 리더보드 엔트리 추가 ──
      addLeaderboardEntry: (hackathonSlug, entry) => {
        set((state) => {
          const lb = state.leaderboards[hackathonSlug];

          if (!lb) {
            return {
              leaderboards: {
                ...state.leaderboards,
                [hackathonSlug]: {
                  updatedAt: new Date().toISOString(),
                  entries: [entry],
                },
              },
            };
          }

          const exists = lb.entries.some((e) => e.teamName === entry.teamName);
          if (exists) return state;

          return {
            leaderboards: {
              ...state.leaderboards,
              [hackathonSlug]: {
                ...lb,
                updatedAt: new Date().toISOString(),
                entries: [...lb.entries, entry],
              },
            },
          };
        });
      },

      // ── 리더보드 타임스탬프 & 순위 업데이트 ──
      updateLeaderboardEntryTimestamp: (hackathonSlug, teamName, submittedAt) => {
        set((state) => {
          const lb = state.leaderboards[hackathonSlug];
          if (!lb) return state;

          let entries: LeaderboardEntry[] = lb.entries.map((e) => {
            if (e.teamName !== teamName) return e;

            if (submittedAt === null) {
              return {
                ...e,
                submittedAt: null,
                score: null,
                rank: null,
              };
            }
            return { ...e, submittedAt };
          });

          // 점수 있는 엔트리 순위 재계산
          const scored = entries
            .filter((e) => e.score !== null)
            .map((e) => ({ ...e }));
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

          // 점수 없는 엔트리
          const unscored = entries
            .filter((e) => e.score === null)
            .map((e) => ({ ...e, rank: null }));

          return {
            leaderboards: {
              ...state.leaderboards,
              [hackathonSlug]: {
                ...lb,
                updatedAt: new Date().toISOString(),
                entries: [...scored, ...unscored],
              },
            },
          };
        });
      },
    }),
    {
      name: 'vibehack-hackathon-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
