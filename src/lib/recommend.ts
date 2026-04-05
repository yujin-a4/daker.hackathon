import { differenceInDays, isFuture } from 'date-fns';
import type { Hackathon, CurrentUser } from '@/types';
import { analyzeHackathonMatch } from './match-analysis';
import { getHackathonMatchContext, includesKeyword, resolveBuckets } from './match-taxonomy';
import { computeHackathonRecruitmentStatus } from './hackathon-utils';

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
    .filter((hackathon) => hackathon.status !== 'ended')
    .map((hackathon) => {
      const reasons: string[] = [];
      const analysis = analyzeHackathonMatch(hackathon, user);
      const recruitmentStatus = computeHackathonRecruitmentStatus(hackathon);

      if (!analysis) {
        return { hackathon, score: 0, reasons: [] };
      }

      let score = analysis.matchRate;
      const hackathonContext = getHackathonMatchContext(hackathon);
      const preferredTypeBuckets = resolveBuckets(user.preferredTypes || []);
      const preferredOverlap = [...preferredTypeBuckets].some((bucket) => hackathonContext.buckets.has(bucket));

      if (
        preferredOverlap ||
        (user.preferredTypes || []).some((item) => includesKeyword(hackathonContext.texts, item))
      ) {
        reasons.push(`${hackathon.type} 분야 선호와 잘 맞아요`);
      }

      if (analysis.matchedSkills.length > 0) {
        reasons.push(`보유 스킬 활용: ${analysis.matchedSkills.slice(0, 2).join(', ')}`);
      } else if (analysis.matchRate >= 40) {
        reasons.push('기술 성향이 대회 주제와 잘 맞아요');
      }

      const deadline = new Date(hackathon.period.submissionDeadlineAt);
      if (isFuture(deadline)) {
        const daysLeft = differenceInDays(deadline, new Date());
        if (daysLeft <= 7) {
          score += 5;
          reasons.push('마감 임박 (7일 이내)');
        }
      }

      if (hackathon.status === 'upcoming') {
        score += 3;
        reasons.push('곧 시작 예정인 대회예요');
      }

      if (hackathon.status === 'ongoing' && recruitmentStatus === 'recruiting') {
        score += 5;
        reasons.push('지금 바로 팀 빌딩에 참여할 수 있어요');
      }

      if (hackathon.status === 'ongoing' && reasons.length < 3) {
        reasons.push(
          recruitmentStatus === 'recruiting'
            ? '현재 진행 중이며 팀 모집도 열려 있어요'
            : '현재 진행 중인 대회예요'
        );
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
