import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CurrentUser, UserProfile } from '@/types';
import { generateId } from '@/lib/utils';
import { currentUser as seedUser, personaPool } from '@/data/seed';
import { useRankingStore } from '@/store/useRankingStore';
import {
  mapLegacyPreferredTypesToInterestDomains,
  mapLegacyRoleToPrimaryRoles,
  splitLegacySkills,
} from '@/lib/match-taxonomy';

interface UserState {
  currentUser: CurrentUser | null;
  allUsers: UserProfile[];
  votedTeamsByHackathon: Record<string, string[]>;
  register: (nickname: string, email: string) => void;
  login: (nickname: string) => void;
  logout: () => void;
  updateProfile: (
    data: Partial<
      Pick<
        CurrentUser,
        'nickname' | 'primaryRoles' | 'interestDomains' | 'techStacks' | 'collaborationStrengths'
      >
    >
  ) => void;
  setAllUsers: (users: UserProfile[]) => void;
  addTeamCode: (teamCode: string) => void;
  removeTeamCode: (teamCode: string) => void;
  toggleBookmark: (slug: string) => void;
  addPointHistory: (description: string, points: number) => void;
  addVotedTeam: (hackathonSlug: string, teamName: string) => boolean;
}

const LEGACY_WELCOME_POINT_DESCRIPTIONS = ['웰컴 포인트', '회원가입 기본 지급'];

const normalizeUserProfile = <T extends Partial<UserProfile & CurrentUser>>(profile: T): T => {
  const primaryRoles = profile.primaryRoles?.length ? profile.primaryRoles : mapLegacyRoleToPrimaryRoles(profile.role);
  const mappedDomains = profile.interestDomains?.length
    ? profile.interestDomains
    : mapLegacyPreferredTypesToInterestDomains(profile.preferredTypes);
  const splitSkills = splitLegacySkills(profile.skills);
  const techStacks = profile.techStacks?.length ? profile.techStacks : splitSkills.techStacks;
  const collaborationStrengths = profile.collaborationStrengths?.length
    ? profile.collaborationStrengths
    : splitSkills.collaborationStrengths;
  const interestDomains = Array.from(new Set([...(mappedDomains || []), ...splitSkills.interestDomains]));

  return {
    ...profile,
    basePoints: profile.basePoints ?? 100,
    bookmarkedSlugs: profile.bookmarkedSlugs || [],
    primaryRoles,
    interestDomains,
    techStacks,
    collaborationStrengths,
    pointHistory: (profile.pointHistory || []).filter(
      (log) => !LEGACY_WELCOME_POINT_DESCRIPTIONS.includes(log.description)
    ),
  } as T;
};

const toCurrentUser = (profile: UserProfile): CurrentUser =>
  normalizeUserProfile({
    ...profile,
    bookmarkedSlugs: profile.bookmarkedSlugs || [],
  });

const upsertUserProfile = (users: UserProfile[], profile: UserProfile) => {
  const filteredUsers = users.filter((user) => user.id !== profile.id);
  return [...filteredUsers, normalizeUserProfile(profile)];
};

const recalculateRankings = () => {
  queueMicrotask(() => {
    useRankingStore.getState().recalculateRankings();
  });
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: normalizeUserProfile(seedUser),
      allUsers: [seedUser, ...personaPool].map((user) => normalizeUserProfile(user as UserProfile)),
      votedTeamsByHackathon: {},

      register: (nickname: string, email: string) => {
        const newUser: CurrentUser = normalizeUserProfile({
          id: generateId('user'),
          nickname,
          email,
          teamCodes: [],
          joinedAt: new Date().toISOString(),
          basePoints: 100,
          bookmarkedSlugs: [],
          primaryRoles: [],
          interestDomains: [],
          techStacks: [],
          collaborationStrengths: [],
          pointHistory: [],
        });

        set((state) => ({
          currentUser: newUser,
          allUsers: upsertUserProfile(state.allUsers, newUser as UserProfile),
        }));
        recalculateRankings();
      },

      login: (nickname: string) => {
        const { currentUser } = get();
        if (currentUser && currentUser.nickname === nickname) return;

        if (nickname === seedUser.nickname) {
          set({ currentUser: normalizeUserProfile(seedUser) });
          recalculateRankings();
          return;
        }

        set((state) => {
          const existingProfile = state.allUsers.find((user) => user.nickname === nickname);
          if (existingProfile) {
            const normalizedProfile = normalizeUserProfile(existingProfile);
            return {
              currentUser: toCurrentUser(normalizedProfile),
              allUsers: upsertUserProfile(state.allUsers, normalizedProfile),
            };
          }

          const newUser: CurrentUser = normalizeUserProfile({
            id: generateId('user'),
            nickname,
            email: '',
            teamCodes: [],
            joinedAt: new Date().toISOString(),
            basePoints: 100,
            bookmarkedSlugs: [],
            primaryRoles: [],
            interestDomains: [],
            techStacks: [],
            collaborationStrengths: [],
            pointHistory: [],
          });

          return {
            currentUser: newUser,
            allUsers: upsertUserProfile(state.allUsers, newUser as UserProfile),
          };
        });
        recalculateRankings();
      },

      setAllUsers: (users: UserProfile[]) =>
        set({ allUsers: users.map((user) => normalizeUserProfile(user as UserProfile)) }),

      logout: () => {
        set({ currentUser: null });
        recalculateRankings();
      },

      updateProfile: (data) => {
        set((state) => {
          if (!state.currentUser) return state;
          const nextCurrentUser = normalizeUserProfile({ ...state.currentUser, ...data });
          return {
            currentUser: nextCurrentUser,
            allUsers: upsertUserProfile(state.allUsers, nextCurrentUser as UserProfile),
          };
        });
        recalculateRankings();
      },

      addTeamCode: (teamCode: string) => {
        set((state) => {
          if (state.currentUser && !state.currentUser.teamCodes.includes(teamCode)) {
            const nextCurrentUser = normalizeUserProfile({
              ...state.currentUser,
              teamCodes: [...state.currentUser.teamCodes, teamCode],
            });

            return {
              currentUser: nextCurrentUser,
              allUsers: upsertUserProfile(state.allUsers, nextCurrentUser as UserProfile),
            };
          }
          return state;
        });
        recalculateRankings();
      },

      removeTeamCode: (teamCode: string) => {
        set((state) => {
          if (state.currentUser && state.currentUser.teamCodes.includes(teamCode)) {
            const nextCurrentUser = normalizeUserProfile({
              ...state.currentUser,
              teamCodes: state.currentUser.teamCodes.filter((code) => code !== teamCode),
            });
            return {
              currentUser: nextCurrentUser,
              allUsers: upsertUserProfile(state.allUsers, nextCurrentUser as UserProfile),
            };
          }
          return state;
        });
        recalculateRankings();
      },

      toggleBookmark: (slug: string) => {
        set((state) => {
          if (!state.currentUser) return state;
          const bookmarkedSlugs = state.currentUser.bookmarkedSlugs || [];
          const isBookmarked = bookmarkedSlugs.includes(slug);
          const newBookmarkedSlugs = isBookmarked
            ? bookmarkedSlugs.filter((item) => item !== slug)
            : [...bookmarkedSlugs, slug];
          const nextCurrentUser = normalizeUserProfile({ ...state.currentUser, bookmarkedSlugs: newBookmarkedSlugs });
          return {
            currentUser: nextCurrentUser,
            allUsers: upsertUserProfile(state.allUsers, nextCurrentUser as UserProfile),
          };
        });
      },

      addPointHistory: (description: string, points: number) => {
        set((state) => {
          if (!state.currentUser) return state;
          const newLog = {
            id: generateId('ph'),
            description,
            points,
            date: new Date().toISOString(),
          };
          const nextCurrentUser = normalizeUserProfile({
            ...state.currentUser,
            pointHistory: [newLog, ...(state.currentUser.pointHistory || [])],
          });
          return {
            currentUser: nextCurrentUser,
            allUsers: upsertUserProfile(state.allUsers, nextCurrentUser as UserProfile),
          };
        });
        recalculateRankings();
      },

      addVotedTeam: (hackathonSlug: string, teamName: string) => {
        const state = get();
        const votedTeams = state.votedTeamsByHackathon[hackathonSlug] || [];
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
      name: 'vibehack-user-storage-v3',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        queueMicrotask(() => {
          useUserStore.setState((prev) => {
            const nextCurrentUser = prev.currentUser ? normalizeUserProfile(prev.currentUser as CurrentUser) : null;
            let nextAllUsers = (prev.allUsers || []).map((user) => normalizeUserProfile(user as UserProfile));
            if (nextCurrentUser) {
              nextAllUsers = upsertUserProfile(nextAllUsers, nextCurrentUser as UserProfile);
            }
            return {
              currentUser: nextCurrentUser,
              allUsers: nextAllUsers,
            };
          });
        });
      },
    }
  )
);
