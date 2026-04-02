import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CurrentUser } from '@/types';
import { generateId } from '@/lib/utils';
import { currentUser as seedUser } from '@/data/seed';

interface UserState {
  currentUser: CurrentUser | null;

  // 인증
  register: (nickname: string, email: string) => void;
  login: (nickname: string) => void;
  logout: () => void;

  // 프로필
  updateProfile: (data: Partial<Pick<CurrentUser, 'nickname' | 'preferredTypes' | 'skills'>>) => void;

  // 기존
  addTeamCode: (teamCode: string) => void;
  removeTeamCode: (teamCode: string) => void;
  toggleBookmark: (slug: string) => void;

  // 🌟 [추가됨] 포인트 이력 적립 함수
  addPointHistory: (description: string, points: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: seedUser,

      register: (nickname: string, email: string) => {
        const newUser: CurrentUser = {
          id: generateId('user'),
          nickname,
          email,
          teamCodes: [],
          joinedAt: new Date().toISOString(),
          bookmarkedSlugs: [],
          role: '',
          preferredTypes: [],
          skills: [],
        };
        set({ currentUser: newUser });
      },

      login: (nickname: string) => {
        const { currentUser } = get();
        if (currentUser && currentUser.nickname === nickname) return;

        if (nickname === '강유진') {
          set({ currentUser: seedUser });
          return;
        }

        set({
          currentUser: {
            id: generateId('user'),
            nickname,
            email: '',
            teamCodes: [],
            joinedAt: new Date().toISOString(),
            bookmarkedSlugs: [],
            preferredTypes: [],
            skills: [],
          },
        });
      },

      logout: () => {
        set({ currentUser: null });
      },

      updateProfile: (data) => {
        set((state) => {
          if (!state.currentUser) return state;
          return { currentUser: { ...state.currentUser, ...data } };
        });
      },

      addTeamCode: (teamCode: string) => {
        set((state) => {
          if (state.currentUser && !state.currentUser.teamCodes.includes(teamCode)) {
            return {
              currentUser: {
                ...state.currentUser,
                teamCodes: [...state.currentUser.teamCodes, teamCode],
              },
            };
          }
          return state;
        });
      },

      removeTeamCode: (teamCode: string) => {
        set((state) => {
          if (state.currentUser && state.currentUser.teamCodes.includes(teamCode)) {
            return {
              currentUser: {
                ...state.currentUser,
                teamCodes: state.currentUser.teamCodes.filter((code) => code !== teamCode),
              },
            };
          }
          return state;
        });
      },

      toggleBookmark: (slug: string) => {
        set((state) => {
          if (!state.currentUser) return state;
          const bookmarkedSlugs = state.currentUser.bookmarkedSlugs || [];
          const isBookmarked = bookmarkedSlugs.includes(slug);
          const newBookmarkedSlugs = isBookmarked
            ? bookmarkedSlugs.filter((s) => s !== slug)
            : [...bookmarkedSlugs, slug];
          return {
            currentUser: { ...state.currentUser, bookmarkedSlugs: newBookmarkedSlugs },
          };
        });
      },

      // 🌟 [추가됨] 포인트 이력 적립
      addPointHistory: (description: string, points: number) => {
        set((state) => {
          if (!state.currentUser) return state;
          const newLog = {
            id: generateId('ph'),
            description,
            points,
            date: new Date().toISOString(),
          };
          return {
            currentUser: {
              ...state.currentUser,
              pointHistory: [newLog, ...(state.currentUser.pointHistory || [])],
            },
          };
        });
      },
    }),
    {
      name: 'vibehack-user-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.currentUser && !state.currentUser.bookmarkedSlugs) {
          state.currentUser.bookmarkedSlugs = [];
        }
      },
    }
  )
);