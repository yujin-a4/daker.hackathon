import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Team } from '@/types';
import { generateId } from '@/lib/utils';

interface TeamState {
  teams: Team[];
  addTeam: (teamData: Omit<Team, 'teamCode' | 'createdAt'>) => Team;
  updateTeam: (teamCode: string, teamUpdate: Partial<Team>) => void;
  deleteTeam: (teamCode: string) => void;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      teams: [],
      addTeam: (teamData) => {
        const newTeam: Team = {
          ...teamData,
          teamCode: generateId('T'),
          createdAt: new Date().toISOString(),
          progressStatus: 'planning',
          progressPercent: 0,
        };
        set((state) => ({
          teams: [...state.teams, newTeam],
        }));
        return newTeam;
      },
      updateTeam: (teamCode, teamUpdate) => {
        set((state) => ({
          teams: state.teams.map((team) =>
            team.teamCode === teamCode ? { ...team, ...teamUpdate } : team
          ),
        }));
      },
      deleteTeam: (teamCode) => {
        set((state) => ({
          teams: state.teams.filter((team) => team.teamCode !== teamCode),
        }));
      },
    }),
    {
      name: 'vibehack-team-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
