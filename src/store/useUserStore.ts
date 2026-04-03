import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CurrentUser, UserProfile } from '@/types';
import { generateId } from '@/lib/utils';
import { currentUser as seedUser, personaPool } from '@/data/seed';

interface UserState {
  currentUser: CurrentUser | null;
  allUsers: UserProfile[];      // 페르소나 + 실제 가입자를 통합하는 단일 소스
  votedTeamsByHackathon: Record<string, string[]>;

  // 인증
  register: (nickname: string, email: string) => void;
  login: (nickname: string) => void;
  logout: () => void;

  // 프로필
  updateProfile: (data: Partial<Pick<CurrentUser, 'nickname' | 'preferredTypes' | 'skills'>>) => void;

  // 페르소나 풀 업데이트
  setAllUsers: (users: UserProfile[]) => void;

  // 기존
  addTeamCode: (teamCode: string) => void;
  removeTeamCode: (teamCode: string) => void;
  toggleBookmark: (slug: string) => void;

  // 🌟 [추가됨] 포인트 이력 적립 함수 및 투표 함수
  addPointHistory: (description: string, points: number) => void;
  addVotedTeam: (hackathonSlug: string, teamName: string) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: seedUser,
      allUsers: [seedUser, ...personaPool] as UserProfile[], // 페르소나풀 + 강유진
      votedTeamsByHackathon: {},

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
        set((state) => ({ 
          currentUser: newUser,
          allUsers: [...state.allUsers.filter(u => u.id !== newUser.id), newUser as UserProfile],
        }));
      },

      login: (nickname: string) => {
        const { currentUser } = get();
        if (currentUser && currentUser.nickname === nickname) return;

        if (nickname === '강유진') {
          set({ currentUser: seedUser });
          return;
        }

        set((state) => ({
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
          allUsers: state.allUsers.some(u => u.nickname === nickname)
            ? state.allUsers
            : [...state.allUsers, { id: generateId('user'), nickname, email: '', teamCodes: [], joinedAt: new Date().toISOString() } as UserProfile]
        }));
      },

      setAllUsers: (users: UserProfile[]) => set({ allUsers: users }),

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
            // 새 팀 참여 시 포인트 지급
            const newHistory = [
              { id: generateId('ph'), description: '팀 합류 (가입)', points: 10, date: new Date().toISOString() },
              ...(state.currentUser.pointHistory || [])
            ];
            
            return {
              currentUser: {
                ...state.currentUser,
                teamCodes: [...state.currentUser.teamCodes, teamCode],
                pointHistory: newHistory,
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

      addVotedTeam: (hackathonSlug: string, teamName: string) => {
        const state = get();
        const votedTeams = state.votedTeamsByHackathon[hackathonSlug] || [];
        
        // 투표는 최대 3팀까지만 가능, 중복 투표 방지
        if (votedTeams.length >= 3 || votedTeams.includes(teamName)) {
          return false;
        }

        set((prevState) => ({
          votedTeamsByHackathon: {
            ...prevState.votedTeamsByHackathon,
            [hackathonSlug]: [...votedTeams, teamName],
          },
        }));
        return true;
      },
    }),
    {
      name: 'vibehack-user-storage-v2',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.currentUser && !state.currentUser.bookmarkedSlugs) {
          state.currentUser.bookmarkedSlugs = [];
        }
      },
    }
  )
);