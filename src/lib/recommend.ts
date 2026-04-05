import { differenceInDays, isFuture } from 'date-fns';
import type { Hackathon, CurrentUser } from '@/types';
import { analyzeHackathonMatch } from './match-analysis';
import {
  getHackathonMatchContext,
  getRelatedOverlap,
  includesKeyword,
  resolveBuckets,
} from './match-taxonomy';
import { computeHackathonRecruitmentStatus } from './hackathon-utils';
import { hasMatchingProfile } from './user-profile';

interface RecommendResult {
  hackathon: Hackathon;
  score: number;
  reasons: string[];
}

function getKeywordMatchCount(keywords: string[], texts: string[]) {
  return keywords.filter((keyword) => includesKeyword(texts, keyword)).length;
}

/**
 * RecommendedSection과 동일한 알고리즘으로 단일 해커톤에 대한 매칭 점수를 계산합니다.
 * MatchStatusTag, MatchAnalysisCard 등 상세 페이지에서도 이 함수를 사용해야 합니다.
 */
export function calculateHackathonMatchScore(
  hackathon: Hackathon,
  user: CurrentUser | null
): number {
  if (!user || !hasMatchingProfile(user)) return 0;

  const hackathonContext = getHackathonMatchContext(hackathon);
  const recruitmentStatus = computeHackathonRecruitmentStatus(hackathon);
  const roleBuckets = resolveBuckets([user.role]);
  const preferredTypeBuckets = resolveBuckets(user.preferredTypes || []);
  const roleDirectMatch = [...roleBuckets].some((bucket) => hackathonContext.buckets.has(bucket));
  const roleRelatedMatch = !roleDirectMatch && !!getRelatedOverlap(roleBuckets, hackathonContext.buckets);
  const preferredDirectMatch = [...preferredTypeBuckets].some((bucket) => hackathonContext.buckets.has(bucket));
  const preferredKeywordMatch =
    !preferredDirectMatch &&
    (user.preferredTypes || []).some((item) => includesKeyword(hackathonContext.texts, item));
  const skillMatchCount = getKeywordMatchCount(user.skills || [], hackathonContext.texts);
  const roleKeywordMatch = user.role ? includesKeyword(hackathonContext.texts, user.role) : false;

  let score = 0;

  if (roleDirectMatch) {
    score += 45;
  } else if (roleRelatedMatch) {
    score += 18;
  }

  if (preferredDirectMatch) {
    score += 20;
  } else if (preferredKeywordMatch) {
    score += 10;
  }

  if (skillMatchCount > 0) {
    score += Math.min(12, skillMatchCount * 6);
  }

  if (roleKeywordMatch && !roleDirectMatch) {
    score += 6;
  }

  const deadline = new Date(hackathon.period.submissionDeadlineAt);
  if (isFuture(deadline)) {
    const daysLeft = differenceInDays(deadline, new Date());
    if (daysLeft <= 7) {
      score += 5;
    }
  }

  if (hackathon.status === 'upcoming' || hackathon.status === 'recruiting') {
    score += 3;
  }

  if (hackathon.status === 'ongoing' && recruitmentStatus === 'recruiting') {
    score += 5;
  }

  if (!roleDirectMatch) {
    score = Math.min(score, preferredDirectMatch ? 62 : 48);
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
      const reasons: string[] = [];
      const recruitmentStatus = computeHackathonRecruitmentStatus(hackathon);
      const analysis = analyzeHackathonMatch(hackathon, user);

      if (!analysis) {
        return { hackathon, score: 0, reasons: [] };
      }

      const hackathonContext = getHackathonMatchContext(hackathon);
      const roleBuckets = resolveBuckets([user.role]);
      const preferredTypeBuckets = resolveBuckets(user.preferredTypes || []);
      const roleDirectMatch = [...roleBuckets].some((bucket) => hackathonContext.buckets.has(bucket));
      const roleRelatedMatch = !roleDirectMatch && !!getRelatedOverlap(roleBuckets, hackathonContext.buckets);
      const preferredDirectMatch = [...preferredTypeBuckets].some((bucket) => hackathonContext.buckets.has(bucket));
      const preferredKeywordMatch =
        !preferredDirectMatch &&
        (user.preferredTypes || []).some((item) => includesKeyword(hackathonContext.texts, item));
      const skillMatchCount = getKeywordMatchCount(user.skills || [], hackathonContext.texts);
      const roleKeywordMatch = user.role ? includesKeyword(hackathonContext.texts, user.role) : false;

      let score = 0;

      if (roleDirectMatch) {
        score += 45;
        reasons.push('직무 직접 일치(+45)');
      } else if (roleRelatedMatch) {
        score += 18;
        reasons.push('직무 인접 연관(+18)');
      }

      if (preferredDirectMatch) {
        score += 20;
        reasons.push('선호 유형 일치(+20)');
      } else if (preferredKeywordMatch) {
        score += 10;
        reasons.push('선호 키워드 일치(+10)');
      }

      if (skillMatchCount > 0) {
        const skillPoints = Math.min(12, skillMatchCount * 6);
        score += skillPoints;
        reasons.push(`${analysis.matchedSkills.slice(0, 2).join(', ')} 스킬 활용(+${skillPoints})`);
      }

      if (roleKeywordMatch && !roleDirectMatch) {
        score += 6;
        reasons.push('역할 키워드 반영(+6)');
      }

      const deadline = new Date(hackathon.period.submissionDeadlineAt);
      if (isFuture(deadline)) {
        const daysLeft = differenceInDays(deadline, new Date());
        if (daysLeft <= 7) {
          score += 5;
          reasons.push('마감 임박(+5)');
        }
      }

      if (hackathon.status === 'upcoming') {
        score += 3;
        reasons.push('시작 임박(+3)');
      }

      if (hackathon.status === 'ongoing' && recruitmentStatus === 'recruiting') {
        score += 5;
        reasons.push('팀 빌딩 가능(+5)');
      }

      if (!roleDirectMatch) {
        score = Math.min(score, preferredDirectMatch ? 62 : 48);
      }

      if (reasons.length < 3) {
        reasons.push(roleDirectMatch ? '주역 적합도 우세' : '팀원 기여 가능');
      }

      return {
        hackathon,
        score: Math.min(100, score),
        reasons: reasons.slice(0, 3),
      };
    })
    .filter((result) => result.score >= 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount);
}
