import { differenceInDays, isFuture } from 'date-fns';
import type { Hackathon, CurrentUser } from '@/types';
import { analyzeHackathonMatch } from './match-analysis';
import { getHackathonMatchContext, includesKeyword, resolveBuckets } from './match-taxonomy';

interface RecommendResult {
  hackathon: Hackathon;
  score: number;
  reasons: string[];
}

export function getRecommendations(
  hackathons: Hackathon[],
  user: CurrentUser | null,
  maxCount: number = 5
): RecommendResult[] {
  if (!user) return [];

  return hackathons
    .filter((hackathon) => hackathon.status === 'recruiting')
    .map((hackathon) => {
      const reasons: string[] = [];
      const analysis = analyzeHackathonMatch(hackathon, user);

      if (!analysis) {
        return { hackathon, score: 0, reasons: [] };
      }

      let score = analysis.matchRate;
      const hackathonContext = getHackathonMatchContext(hackathon);
      const preferredTypeBuckets = resolveBuckets(user.preferredTypes || []);
      const preferredOverlap = [...preferredTypeBuckets].some((bucket) => hackathonContext.buckets.has(bucket));

      if (preferredOverlap || (user.preferredTypes || []).some((item) => includesKeyword(hackathonContext.texts, item))) {
        reasons.push(`${hackathon.type} 분야 선호와 잘 맞아요`);
      }

      if (analysis.matchedSkills.length > 0) {
        reasons.push(`보유 스킬 활용: ${analysis.matchedSkills.slice(0, 2).join(', ')}`);
      } else if (analysis.matchRate >= 40) {
        reasons.push('기술 성향이 해커톤 주제와 잘 맞아요');
      }

      const deadline = new Date(hackathon.period.submissionDeadlineAt);
      if (isFuture(deadline)) {
        const daysLeft = differenceInDays(deadline, new Date());
        if (daysLeft <= 7) {
          score += 5;
          reasons.push('마감 임박 (7일 이내)');
        }
      }

      if (hackathon.status === 'recruiting') {
        score += 5;
        reasons.push('지금 바로 참가 가능');
      }

      if (hackathon.status === 'ongoing' && reasons.length < 3) {
        reasons.push('현재 진행 중');
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
