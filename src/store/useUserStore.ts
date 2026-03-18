import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CurrentUser } from '@/types';

interface UserState {
  currentUser: CurrentUser | null;
  addTeamCode: (teamCode: string) => void;
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
    }),
    {
      name: 'vibehack-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
