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
      // 🔥 시니어의 매직: 초기 접속 시 '강유진' 님으로 자동 로그인 상태 세팅
      currentUser: {
        id: 'dummy-user-yujin-001',
        nickname: '강유진',
        email: 'yujin.kang@daker.ai',
        teamCodes: ['T-HANDOVER-01'], // 404found 팀 소속으로 세팅
        joinedAt: new Date().toISOString(),
        bookmarkedSlugs: ['daker-handover-2026-03'], // 해커톤 북마크
        role: '프론트엔드 개발자',
        preferredTypes: ['Web', 'VibeCoding'],
        skills: ['React', 'Next.js', 'Tailwind CSS'],
      },

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
