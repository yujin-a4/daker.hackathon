import type { CurrentUser, Team } from '@/types';
import { useHackathonStore } from '@/store/useHackathonStore';
import { hasMatchingProfile } from '@/lib/user-profile';
import { isTeamRecruiting } from '@/lib/team-recruiting';
import {
  getHackathonMatchContext,
  getRelatedOverlap,
  getUserMatchContext,
  includesKeyword,
  resolveBuckets,
} from '@/lib/match-taxonomy';

export interface MatchingResult {
  team: Team;
  score: number;
  matchReasons: string[];
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

  const teamRoleTexts = team.lookingFor.flatMap((item) => [item.position, item.description]);
  const hackathonContext = hackathon ? getHackathonMatchContext(hackathon) : { texts: [], buckets: new Set() };
  const teamContextTexts = [team.intro, ...teamRoleTexts, ...hackathonContext.texts];

  const userContext = getUserMatchContext(user);
  const userBuckets = userContext.buckets;
  const teamRoleBuckets = resolveBuckets(teamRoleTexts);
  const hackathonBuckets = hackathonContext.buckets;

  const directRoleBuckets = [...userBuckets].filter((bucket) => teamRoleBuckets.has(bucket));
  if (directRoleBuckets.length > 0) {
    score += 40;
    matchReasons.push('현재 팀이 회원님 역량과 직접 맞는 포지션을 찾고 있어요');
  } else if (userBuckets.size > 0 && teamRoleBuckets.size > 0) {
    const relatedBucket = getRelatedOverlap(userBuckets, teamRoleBuckets);
    if (relatedBucket) {
      score += 22;
      matchReasons.push('현재 모집 포지션과 협업 시너지가 좋은 팀이에요');
    }
  }

  const matchedSkills = (user.skills || []).filter((skill) => includesKeyword(teamContextTexts, skill));
  if (matchedSkills.length > 0) {
    score += Math.min(24, matchedSkills.length * 12);
    matchReasons.push(`${matchedSkills.slice(0, 2).join(', ')} 경험을 바로 활용할 수 있어요`);
  } else {
    const skillBuckets = resolveBuckets(user.skills || []);
    const skillBucketOverlap = [...skillBuckets].filter(
      (bucket) => teamRoleBuckets.has(bucket) || hackathonBuckets.has(bucket)
    );
    if (skillBucketOverlap.length > 0) {
      score += 14;
      matchReasons.push('보유 스킬 성향이 팀이 만드는 방향과 잘 맞아요');
    }
  }

  const preferredTypeBuckets = resolveBuckets(user.preferredTypes || []);
  const preferredOverlap = [...preferredTypeBuckets].filter((bucket) => hackathonBuckets.has(bucket));
  if (preferredOverlap.length > 0) {
    score += 20;
    matchReasons.push(`${hackathon?.type || '관심 분야'} 성격의 해커톤이라 선호도와 맞아요`);
  }

  const explicitInterestOverlap = (user.preferredTypes || []).some((pref) => includesKeyword(hackathonContext.texts, pref));
  if (explicitInterestOverlap && preferredOverlap.length === 0) {
    score += 10;
    matchReasons.push('선호 분야 키워드가 해커톤 주제와 겹쳐요');
  }

  if (recruiting && score > 0) {
    score += 8;
    if (team.memberCount >= team.maxTeamSize - 1) {
      matchReasons.push('곧 모집 마감이라 빠르게 합류 판단하기 좋아요');
    }
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
