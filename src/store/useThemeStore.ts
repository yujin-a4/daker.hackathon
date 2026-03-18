import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ThemeState = {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'vibehack-theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
