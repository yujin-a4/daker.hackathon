import { differenceInDays, isFuture } from 'date-fns';
import type { Hackathon, CurrentUser } from '@/types';
import { analyzeHackathonMatch } from './match-analysis';

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

  const scored: RecommendResult[] = hackathons
    .filter((h) => h.status !== 'ended')
    .map((h) => {
      const reasons: string[] = [];
      const analysis = analyzeHackathonMatch(h, user);

      if (!analysis) return { hackathon: h, score: 0, reasons: [] };

      let score = analysis.matchRate;

      if (user?.role && h.type && analysis.matchRate >= 40) {
        reasons.push(`${h.type} 분야 & ${user.role} 역할 매칭`);
      }

      if (analysis.matchedSkills.length > 0) {
        reasons.push(`보유 스킬 일치: ${analysis.matchedSkills.slice(0, 2).join(', ')}`);
      }

      const deadline = new Date(h.period.submissionDeadlineAt);
      if (isFuture(deadline)) {
        const daysLeft = differenceInDays(deadline, new Date());
        if (daysLeft <= 7) {
          score += 5;
          reasons.push('마감 임박 (7일 이내)');
        }
      }

      if (h.status === 'recruiting') {
        score += 8;
        reasons.push('지금 바로 참가 가능');
      }

      if (h.status === 'ongoing') {
        reasons.push('현재 진행 중');
      }

      return {
        hackathon: h,
        score: Math.min(100, score),
        reasons: reasons.slice(0, 3),
      };
    })
    .filter((r) => r.score > 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount);

  return scored;
}
