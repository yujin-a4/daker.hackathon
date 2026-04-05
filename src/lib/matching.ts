import type { CurrentUser, Team } from '@/types';
import { useHackathonStore } from '@/store/useHackathonStore';
import { hasMatchingProfile } from '@/lib/user-profile';
import { isTeamRecruiting } from '@/lib/team-recruiting';
import {
  getRelatedRoleOverlap,
  getTeamCollaborationSet,
  getTeamDomainSet,
  getTeamRoleSet,
  getTeamTechSet,
  getUserCollaborationSet,
  getUserDomainSet,
  getUserRoleSet,
  getUserTechSet,
} from '@/lib/match-taxonomy';

export interface MatchingResult {
  team: Team;
  score: number;
  matchReasons: string[];
}

function overlapCount<T>(source: Set<T>, target: Set<T>) {
  return [...source].filter((item) => target.has(item)).length;
}

function getHackathonContext(team: Team) {
  if (!team.hackathonSlug) return null;
  return useHackathonStore.getState().hackathons.find((item) => item.slug === team.hackathonSlug) || null;
}

export function calculateMatchScore(user: CurrentUser, team: Team): MatchingResult {
  if (!hasMatchingProfile(user)) {
    return { team, score: 0, matchReasons: [] };
  }

  let score = 0;
  const matchReasons: string[] = [];
  const hackathon = getHackathonContext(team);
  const recruiting = isTeamRecruiting(team, hackathon);

  const userRoles = getUserRoleSet(user);
  const userDomains = getUserDomainSet(user);
  const userTechStacks = getUserTechSet(user);
  const userCollaboration = getUserCollaborationSet(user);
  const teamRoles = getTeamRoleSet(team, hackathon);
  const teamDomains = getTeamDomainSet(team, hackathon);
  const teamTechStacks = getTeamTechSet(team, hackathon);
  const teamCollaboration = getTeamCollaborationSet(team);

  const directRoleMatches = [...userRoles].filter((role) => teamRoles.has(role));
  if (directRoleMatches.length > 0) {
    score += 50;
    matchReasons.push(`${directRoleMatches.slice(0, 2).join(', ')} 포지션 모집 중`);
  } else {
    const relatedRole = getRelatedRoleOverlap(userRoles, teamRoles);
    if (relatedRole) {
      score += 28;
      matchReasons.push(`${relatedRole} 인접 역할로 기여 가능`);
    }
  }

  const matchedTechStacks = [...userTechStacks].filter((stack) => teamTechStacks.has(stack));
  if (matchedTechStacks.length > 0) {
    score += Math.min(30, matchedTechStacks.length * 10);
    matchReasons.push(`${matchedTechStacks.slice(0, 2).join(', ')} 바로 활용 가능`);
  }

  const matchedDomains = [...userDomains].filter((domain) => teamDomains.has(domain));
  if (matchedDomains.length > 0) {
    score += Math.min(15, matchedDomains.length * 8);
    matchReasons.push(`${matchedDomains.slice(0, 2).join(', ')} 분야 선호 일치`);
  }

  const matchedCollaboration = [...userCollaboration].filter((item) => teamCollaboration.has(item));
  if (matchedCollaboration.length > 0) {
    score += 5;
  }

  if (recruiting && score > 0) {
    score += 5;
  }

  return { team, score: Math.min(score, 100), matchReasons: matchReasons.slice(0, 3) };
}

export function getRecommendedTeams(user: CurrentUser, allTeams: Team[], limit: number = 3): MatchingResult[] {
  if (!hasMatchingProfile(user)) return [];

  return allTeams
    .filter((team) => !team.isSolo && isTeamRecruiting(team, getHackathonContext(team)) && !user.teamCodes.includes(team.teamCode))
    .map((team) => calculateMatchScore(user, team))
    .filter((result) => result.score >= 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
