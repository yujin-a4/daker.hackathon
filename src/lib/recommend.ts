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

      // 1. 유형 및 역할 매칭 여부 (analysis에 포함됨)
      if (user?.role && h.type && analysis.matchRate >= 40) {
        reasons.push(`${h.type} 분야 & ${user.role} 역량 매칭`);
      }

      // 2. 태그 매칭 상세
      if (analysis.matchedSkills.length > 0) {
        reasons.push(`보유 스킬 일치: ${analysis.matchedSkills.slice(0, 2).join(', ')}`);
      }

      // 3. 마감 임박 가중치 (추가 가중치: 5점 - 전체 점수를 위해 살짝 조정하거나 유지)
      const deadline = new Date(h.period.submissionDeadlineAt);
      if (isFuture(deadline)) {
        const daysLeft = differenceInDays(deadline, new Date());
        if (daysLeft <= 7) {
          score += 5;
          reasons.push(`마감 임박 (7일 이내)`);
        }
      }

      // 4. 진행중 가중치
      if (h.status === 'ongoing') {
        reasons.push('현재 진행 중');
      }

      return { 
        hackathon: h, 
        score: Math.min(100, score), // 100점 만점으로 정규화
        reasons: reasons.slice(0, 3) // 사유는 3개까지만
      };
    })
    .filter((r) => r.score > 10) // 어느 정도 매칭되는 것만 추천
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount);

  return scored;
}

