import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CurrentUser } from '@/types';
import { generateId } from '@/lib/utils';

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
  toggleBookmark: (slug: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,

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
        // localStorage 기반이라 별도 인증 없이 기존 유저 복원
        // 이미 persist로 저장되어 있으므로, 이 함수는 시드 유저로 로그인할 때 사용
        const { currentUser } = get();
        if (currentUser && currentUser.nickname === nickname) return;
        // 새 세션 (간단 로그인)
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
          return {
            currentUser: { ...state.currentUser, ...data },
          };
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

      toggleBookmark: (slug: string) => {
        set((state) => {
          if (!state.currentUser) return state;
          const bookmarkedSlugs = state.currentUser.bookmarkedSlugs || [];
          const isBookmarked = bookmarkedSlugs.includes(slug);
          const newBookmarkedSlugs = isBookmarked
            ? bookmarkedSlugs.filter((s) => s !== slug)
            : [...bookmarkedSlugs, slug];
          return {
            currentUser: {
              ...state.currentUser,
              bookmarkedSlugs: newBookmarkedSlugs,
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
