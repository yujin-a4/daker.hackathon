import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Team, TeamMemo } from '@/types';
import { generateId } from '@/lib/utils';
import { useUserStore } from './useUserStore';

interface TeamState {
  teams: Team[];
  addTeam: (teamData: Omit<Team, 'teamCode' | 'createdAt'>) => Team;
  updateTeam: (teamCode: string, teamUpdate: Partial<Team>) => void;
  deleteTeam: (teamCode: string) => void;
  setAiChecklist: (teamCode: string, phase: string, items: { id: string; text: string; completed: boolean }[]) => void;
  toggleAiChecklistItem: (teamCode: string, phase: string, itemId: string) => void;
  setAiStrategy: (teamCode: string, phase: string, strategy: string) => void;
  addTeamMemo: (teamCode: string, memo: { title: string; content: string }) => void;
  removeTeamMemo: (teamCode: string, memoId: string) => void;
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
        
        // 🌟 팀 창설 시 30점 랭킹 포인트 부여
        useUserStore.getState().addPointHistory('팀 창설 완료', 30);
        
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
      setAiChecklist: (teamCode, phase, items) => {
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.teamCode !== teamCode) return team;
            return {
              ...team,
              aiChecklists: {
                ...(team.aiChecklists || {}),
                [phase]: items,
              },
            };
          }),
        }));
      },
      toggleAiChecklistItem: (teamCode, phase, itemId) => {
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.teamCode !== teamCode || !team.aiChecklists?.[phase]) return team;
            return {
              ...team,
              aiChecklists: {
                ...team.aiChecklists,
                [phase]: team.aiChecklists[phase].map((item) =>
                  item.id === itemId ? { ...item, completed: !item.completed } : item
                ),
              },
            };
          }),
        }));
      },
      setAiStrategy: (teamCode, phase, strategy) => {
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.teamCode !== teamCode) return team;
            return {
              ...team,
              aiStrategy: {
                ...(team.aiStrategy || {}),
                [phase]: strategy,
              },
            };
          }),
        }));
      },
      addTeamMemo: (teamCode, memo) => {
        const newMemo: TeamMemo = {
          ...memo,
          id: generateId('MEMO'),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.teamCode !== teamCode) return team;
            return {
              ...team,
              teamMemos: [...(team.teamMemos || []), newMemo],
            };
          }),
        }));
      },
      removeTeamMemo: (teamCode, memoId) => {
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.teamCode !== teamCode) return team;
            return {
              ...team,
              teamMemos: (team.teamMemos || []).filter((m) => m.id !== memoId),
            };
          }),
        }));
      },
    }),
    {
      name: 'vibehack-team-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
