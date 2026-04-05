import { differenceInDays, isFuture } from 'date-fns';
import type { Hackathon, CurrentUser } from '@/types';
import { analyzeHackathonMatch } from './match-analysis';
import {
  getHackathonDomainSet,
  getHackathonRoleSet,
  getHackathonTechSet,
  getRelatedRoleOverlap,
  getUserDomainSet,
  getUserRoleSet,
  getUserTechSet,
} from './match-taxonomy';
import { computeHackathonRecruitmentStatus } from './hackathon-utils';
import { hasMatchingProfile } from './user-profile';

interface RecommendResult {
  hackathon: Hackathon;
  score: number;
  reasons: string[];
}

function overlapCount<T>(source: Set<T>, target: Set<T>) {
  return [...source].filter((item) => target.has(item)).length;
}

export function calculateHackathonMatchScore(hackathon: Hackathon, user: CurrentUser | null): number {
  if (!user || !hasMatchingProfile(user)) return 0;

  const userRoles = getUserRoleSet(user);
  const userDomains = getUserDomainSet(user);
  const userTechStacks = getUserTechSet(user);
  const hackathonRoles = getHackathonRoleSet(hackathon);
  const hackathonDomains = getHackathonDomainSet(hackathon);
  const hackathonTechStacks = getHackathonTechSet(hackathon);
  const recruitmentStatus = computeHackathonRecruitmentStatus(hackathon);

  const directDomainMatches = overlapCount(userDomains, hackathonDomains);
  const directRoleMatches = overlapCount(userRoles, hackathonRoles);
  const techMatches = overlapCount(userTechStacks, hackathonTechStacks);
  const relatedRoleMatch = directRoleMatches === 0 ? getRelatedRoleOverlap(userRoles, hackathonRoles) : null;

  let score = 0;

  if (directDomainMatches > 0) {
    score += 45;
  } else if (hackathonDomains.size === 0 && userDomains.size > 0) {
    score += 10;
  }

  if (directRoleMatches > 0) {
    score += 25;
  } else if (relatedRoleMatch) {
    score += 12;
  }

  if (techMatches > 0) {
    score += Math.min(20, techMatches * 10);
  }

  if (hackathon.status === 'recruiting' || recruitmentStatus === 'recruiting') {
    score += 6;
  } else if (hackathon.status === 'ongoing') {
    score += 3;
  }

  const deadline = new Date(hackathon.period.submissionDeadlineAt);
  if (isFuture(deadline)) {
    const daysLeft = differenceInDays(deadline, new Date());
    if (daysLeft <= 7) score += 4;
  }

  return Math.min(100, score);
}

export function getRecommendations(
  hackathons: Hackathon[],
  user: CurrentUser | null,
  maxCount: number = 5
): RecommendResult[] {
  if (!user) return [];

  return hackathons
    .filter((hackathon) => hackathon.status !== 'ended')
    .map((hackathon) => {
      const analysis = analyzeHackathonMatch(hackathon, user);
      if (!analysis) {
        return { hackathon, score: 0, reasons: [] };
      }

      const score = calculateHackathonMatchScore(hackathon, user);
      const reasons: string[] = [];

      if (analysis.matchedDomains.length > 0) {
        reasons.push(`${analysis.matchedDomains.slice(0, 2).join(', ')} 분야 적합`);
      }
      if (analysis.matchedRoles.length > 0) {
        reasons.push(`${analysis.matchedRoles.slice(0, 2).join(', ')} 역할 적합`);
      }
      if (analysis.matchedSkills.length > 0) {
        reasons.push(`${analysis.matchedSkills.slice(0, 2).join(', ')} 활용 가능`);
      }

      if (reasons.length < 3) {
        const recruitmentStatus = computeHackathonRecruitmentStatus(hackathon);
        reasons.push(recruitmentStatus === 'recruiting' ? '지금 참가 준비 가능' : '분야 탐색 추천');
      }

      return {
        hackathon,
        score,
        reasons: reasons.slice(0, 3),
      };
    })
    .filter((result) => result.score >= 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount);
}
