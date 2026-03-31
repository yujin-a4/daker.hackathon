import { differenceInDays, isFuture } from 'date-fns';
import type { Hackathon, CurrentUser } from '@/types';

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

  const preferredTypes = user.preferredTypes || [];
  const userSkills = user.skills || [];

  if (preferredTypes.length === 0 && userSkills.length === 0) return [];

  const scored: RecommendResult[] = hackathons
    .filter((h) => h.status !== 'ended')
    .map((h) => {
      let score = 0;
      const reasons: string[] = [];
      const now = new Date();
      const deadline = new Date(h.period.submissionDeadlineAt);

      // 1. 유형 매칭 (40점)
      if (preferredTypes.includes(h.type)) {
        score += 40;
        reasons.push(`${h.type} 유형 일치 (+40)`);
      }

      // 2. 태그-스킬 매칭 (태그 1개당 15점, 최대 45점)
      const matchedTags = h.tags?.filter((tag) => userSkills.includes(tag)) || [];
      if (matchedTags.length > 0) {
        const skillScore = Math.min(matchedTags.length * 15, 45);
        score += skillScore;
        reasons.push(`보유 스킬 매칭: ${matchedTags.join(', ')} (+${skillScore})`);
      }

      // 3. 진행중 보너스 (10점)
      if (h.status === 'ongoing') {
        score += 10;
        reasons.push('현재 진행 중인 대회 (+10)');
      }

      // 4. 마감 임박 가중치 (추가 가중치: 20점)
      if (isFuture(deadline)) {
        const daysLeft = differenceInDays(deadline, now);
        if (daysLeft <= 7) {
          score += 20;
          reasons.push(`마감 7일 이내 임박 대회 (+20)`);
        }
      }

      // 5. 참가자 수 인기도 보너스 (5점)
      if (h.participantCount >= 200) {
        score += 5;
        reasons.push('인기 대회 (+5)');
      }

      return { hackathon: h, score, reasons };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount);

  return scored;
}
