import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CurrentUser } from '@/types';

interface UserState {
  currentUser: CurrentUser | null;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
    }),
    {
      name: 'vibehack-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
