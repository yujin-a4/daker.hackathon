import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CurrentUser } from '@/types';

interface UserState {
  currentUser: CurrentUser | null;
  addTeamCode: (teamCode: string) => void;
  toggleBookmark: (slug: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
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
            ? bookmarkedSlugs.filter(s => s !== slug)
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
      }
    }
  )
);
