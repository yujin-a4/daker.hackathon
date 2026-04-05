import type { CurrentUser, Team, UserProfile } from '@/types';

export type TeamCompositionMember = {
  id: string;
  nickname: string;
  primaryRoles?: string[];
  techStacks?: string[];
  isLeader: boolean;
  isSynthetic?: boolean;
};

export type TeamComposition = {
  members: TeamCompositionMember[];
  confirmedMemberCount: number;
  visibleMemberCount: number;
  hiddenConfirmedCount: number;
  openSlotCount: number;
};

const dedupeUsers = (allUsers: UserProfile[], currentUser: CurrentUser | null) => {
  const map = new Map<string, UserProfile>();

  allUsers.forEach((user) => {
    map.set(user.id, user);
  });

  if (currentUser) {
    map.set(currentUser.id, currentUser);
  }

  return Array.from(map.values());
};

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function buildSyntheticMembers(
  team: Team,
  users: UserProfile[],
  existingMemberIds: Set<string>,
  neededCount: number
): TeamCompositionMember[] {
  if (neededCount <= 0) return [];

  const candidatePool = users.filter((user) => !existingMemberIds.has(user.id));
  if (candidatePool.length === 0) return [];

  const seed = hashString(`${team.teamCode}:${team.name}:${team.leaderId}`);
  const offset = seed % candidatePool.length;
  const rotatedCandidates = [...candidatePool.slice(offset), ...candidatePool.slice(0, offset)];

  return rotatedCandidates.slice(0, neededCount).map((member) => ({
    id: `${team.teamCode}:${member.id}`,
    nickname: member.nickname,
    primaryRoles: member.primaryRoles,
    techStacks: member.techStacks,
    isLeader: false,
    isSynthetic: true,
  }));
}

export function getTeamComposition(team: Team, allUsers: UserProfile[], currentUser: CurrentUser | null): TeamComposition {
  const users = dedupeUsers(allUsers, currentUser);
  const knownMembers = users.filter((user) => user.id === team.leaderId || user.teamCodes.includes(team.teamCode));
  const uniqueKnownMembers = Array.from(new Map(knownMembers.map((member) => [member.id, member])).values());

  const confirmedMemberCount = Math.max(team.memberCount, uniqueKnownMembers.length);
  const syntheticMembers = buildSyntheticMembers(
    team,
    users,
    new Set(uniqueKnownMembers.map((member) => member.id)),
    Math.max(confirmedMemberCount - uniqueKnownMembers.length, 0)
  );
  const visibleMembers: TeamCompositionMember[] = [
    ...uniqueKnownMembers.map((member) => ({
      id: member.id,
      nickname: member.nickname,
      primaryRoles: member.primaryRoles,
      techStacks: member.techStacks,
      isLeader: member.id === team.leaderId,
      isSynthetic: false,
    })),
    ...syntheticMembers,
  ];
  const visibleMemberCount = visibleMembers.length;

  return {
    members: visibleMembers,
    confirmedMemberCount,
    visibleMemberCount,
    hiddenConfirmedCount: Math.max(confirmedMemberCount - visibleMemberCount, 0),
    openSlotCount: Math.max(team.maxTeamSize - confirmedMemberCount, 0),
  };
}
