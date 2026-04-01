import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Team, TeamMemo } from '@/types';
import { generateId } from '@/lib/utils';

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
  joinTeam: (teamCode: string, userId: string) => void;
  leaveTeam: (teamCode: string, userId: string) => void;
  applyToTeam: (teamCode: string, userId: string) => void;
  acceptApplicant: (teamCode: string, userId: string) => void;
  rejectApplicant: (teamCode: string, userId: string) => void;
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
          memberIds: [teamData.leaderId],
          applicantIds: [],
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
      joinTeam: (teamCode, userId) => {
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.teamCode !== teamCode) return team;
            const currentMemberIds = team.memberIds || [team.leaderId];
            if (currentMemberIds.includes(userId)) return team;
            if (team.memberCount >= team.maxTeamSize) return team;
            
            return {
              ...team,
              memberIds: [...currentMemberIds, userId],
              memberCount: team.memberCount + 1,
            };
          }),
        }));
      },
      leaveTeam: (teamCode, userId) => {
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.teamCode !== teamCode) return team;
            if (team.leaderId === userId) return team;
            const currentMemberIds = team.memberIds || [team.leaderId];
            if (!currentMemberIds.includes(userId)) return team;

            return {
              ...team,
              memberIds: currentMemberIds.filter((id) => id !== userId),
              memberCount: Math.max(1, team.memberCount - 1),
            };
          }),
        }));
      },
      applyToTeam: (teamCode, userId) => {
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.teamCode !== teamCode) return team;
            const currentMemberIds = team.memberIds || [team.leaderId];
            const currentApplicantIds = team.applicantIds || [];
            
            if (currentMemberIds.includes(userId)) return team;
            if (currentApplicantIds.includes(userId)) return team;
            if (team.memberCount >= team.maxTeamSize) return team;

            return {
              ...team,
              applicantIds: [...currentApplicantIds, userId],
            };
          }),
        }));
      },
      acceptApplicant: (teamCode, userId) => {
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.teamCode !== teamCode) return team;
            const currentApplicantIds = team.applicantIds || [];
            if (!currentApplicantIds.includes(userId)) return team;
            if (team.memberCount >= team.maxTeamSize) return team;

            const currentMemberIds = team.memberIds || [team.leaderId];
            return {
              ...team,
              applicantIds: currentApplicantIds.filter(id => id !== userId),
              memberIds: [...currentMemberIds, userId],
              memberCount: team.memberCount + 1,
            };
          }),
        }));
      },
      rejectApplicant: (teamCode, userId) => {
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.teamCode !== teamCode) return team;
            const currentApplicantIds = team.applicantIds || [];
            if (!currentApplicantIds.includes(userId)) return team;

            return {
              ...team,
              applicantIds: currentApplicantIds.filter(id => id !== userId),
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
