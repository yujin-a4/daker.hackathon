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

      // 1. 유형 매칭 (40점)
      if (preferredTypes.includes(h.type)) {
        score += 40;
        reasons.push(`${h.type} 유형 일치`);
      }

      // 2. 태그-스킬 매칭 (태그 1개당 15점, 최대 45점)
      const matchedTags = h.tags?.filter((tag) => userSkills.includes(tag)) || [];
      if (matchedTags.length > 0) {
        score += Math.min(matchedTags.length * 15, 45);
        reasons.push(`보유 스킬 매칭: ${matchedTags.join(', ')}`);
      }

      // 3. 진행중 보너스 (10점)
      if (h.status === 'ongoing') {
        score += 10;
      }

      // 4. 참가자 수 인기도 보너스 (최대 5점)
      if (h.participantCount >= 200) {
        score += 5;
        reasons.push('인기 대회');
      }

      return { hackathon: h, score, reasons };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount);

  return scored;
}
