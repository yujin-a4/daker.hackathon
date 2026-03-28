import type { Team, CurrentUser } from '@/types';

export interface MatchingResult {
  team: Team;
  score: number;
  matchReasons: string[];
}

/**
 * 유저의 역할과 기술 스택을 바탕으로 팀과의 매칭 점수를 계산합니다.
 */
export function calculateMatchScore(user: CurrentUser, team: Team): MatchingResult {
  let score = 0;
  const matchReasons: string[] = [];

  // 1. 역할 매칭 (60점)
  const myRole = user.role?.toLowerCase() || '';
  const isLookingForMyRole = team.lookingFor.some(lf => {
    const role = lf.position.toLowerCase();
    return role.includes(myRole) || myRole.includes(role);
  });

  if (isLookingForMyRole) {
    score += 60;
    matchReasons.push(`${user.role} 포지션을 간절히 찾고 있는 팀`);
  } else {
    // 서브 역할 매칭 (기타 등등)
    const isRelatedRole = team.lookingFor.some(lf => {
      const role = lf.position.toLowerCase();
      if ((myRole.includes('개발') && role.includes('개발')) || (myRole.includes('디자인') && role.includes('디자인'))) return true;
      return false;
    });
    if (isRelatedRole) {
      score += 30;
      matchReasons.push(`${user.role} 직무 역량을 발휘할 수 있는 팀`);
    }
  }

  // 2. 기술 스택 매칭 (최대 20점)
  const mySkills = user.skills || [];
  const matchedSkills = mySkills.filter(skill => 
    team.intro.toLowerCase().includes(skill.toLowerCase()) ||
    team.lookingFor.some(lf => lf.description?.toLowerCase().includes(skill.toLowerCase()))
  );

  if (matchedSkills.length > 0) {
    const skillScore = Math.min(matchedSkills.length * 10, 20);
    score += skillScore;
    matchReasons.push(`${matchedSkills.slice(0, 2).join(', ')} 등 보유 스택 활용 가능`);
  }

  // 3. 관심 분야 매칭 (15점)
  const myPrefs = user.preferredTypes || [];
  const isPreferredType = team.hackathonSlug && myPrefs.some(pref => 
    team.hackathonSlug?.toLowerCase().includes(pref.toLowerCase())
  );

  if (isPreferredType) {
    score += 15;
    matchReasons.push('관심 분야의 해커톤 참가 팀');
  }

  // 4. 활동성 및 팀 상태 (최대 5점)
  if (team.isOpen) {
    score += 5;
    if (team.memberCount >= team.maxTeamSize - 1) {
      matchReasons.push('곧 모집 마감! 빠른 합류가 필요해요');
    }
  }

  // 점수 정규화 (최대 100점)
  const finalScore = Math.min(score, 100);

  return { team, score: finalScore, matchReasons };
}

/**
 * 모든 팀 중 유저에게 가장 잘 맞는 팀들을 추천순으로 정렬하여 반환합니다.
 */
export function getRecommendedTeams(user: CurrentUser, allTeams: Team[], limit: number = 3): MatchingResult[] {
  return allTeams
    .filter(t => !t.isSolo && t.isOpen)
    .map(t => calculateMatchScore(user, t))
    .filter(res => res.score >= 40) // 일정 점수 이상의 유의미한 팀만 추천
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
