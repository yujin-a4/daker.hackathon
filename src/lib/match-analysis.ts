import type { Hackathon, CurrentUser } from '@/types';
import { hasMatchingProfile } from '@/lib/user-profile';
import {
  getHackathonDomainSet,
  getHackathonRoleSet,
  getHackathonTechSet,
  getRelatedRoleOverlap,
  getUserDomainSet,
  getUserRoleSet,
  getUserTechSet,
} from '@/lib/match-taxonomy';

export interface MatchAnalysisResult {
  matchRate: number;
  suggestedRole: string;
  matchedRoles: string[];
  matchedDomains: string[];
  matchedSkills: string[];
  missingSkills: string[];
  roleDescription: string;
  neededTeamRoles: string[];
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  기획: '문제 정의와 방향 설정을 주도하기 좋은 포지션입니다.',
  디자인: '사용자 경험과 프로토타입 완성도에 강점을 낼 수 있습니다.',
  프론트엔드: '사용자 화면 구현과 프로덕트 완성도를 끌어올리기 좋습니다.',
  백엔드: '서버, 데이터, API 구조를 안정적으로 만드는 역할에 적합합니다.',
  풀스택: 'MVP를 빠르게 연결하고 전체 구현을 이어가기 좋습니다.',
  모바일: '모바일 경험이 중요한 주제에서 강점을 낼 수 있습니다.',
  'AI 개발': 'AI 기능 구현과 모델 활용이 필요한 해커톤에 잘 맞습니다.',
  데이터: '데이터 분석과 인사이트 도출이 중요한 주제에 적합합니다.',
  DevOps: '배포, 인프라, 운영 안정성이 중요한 프로젝트에 강합니다.',
  보안: '보안 검토와 취약점 대응이 필요한 주제에 잘 맞습니다.',
};

export function analyzeHackathonMatch(hackathon: Hackathon, user: CurrentUser | null): MatchAnalysisResult | null {
  if (!user || !hasMatchingProfile(user)) return null;

  const userRoles = getUserRoleSet(user);
  const userDomains = getUserDomainSet(user);
  const userTechStacks = getUserTechSet(user);
  const hackathonRoles = getHackathonRoleSet(hackathon);
  const hackathonDomains = getHackathonDomainSet(hackathon);
  const hackathonTechStacks = getHackathonTechSet(hackathon);

  const matchedRoles = [...userRoles].filter((role) => hackathonRoles.has(role));
  const matchedDomains = [...userDomains].filter((domain) => hackathonDomains.has(domain));
  const matchedSkills = [...userTechStacks].filter((skill) => hackathonTechStacks.has(skill));
  const missingSkills = [...hackathonTechStacks].filter((skill) => !userTechStacks.has(skill)).slice(0, 4);

  let score = 0;
  if (matchedDomains.length > 0) score += 45;
  if (matchedRoles.length > 0) score += 25;
  else if (getRelatedRoleOverlap(userRoles, hackathonRoles)) score += 12;
  if (matchedSkills.length > 0) score += Math.min(20, matchedSkills.length * 10);
  if (hackathon.status === 'recruiting') score += 5;

  const suggestedRole =
    matchedRoles[0] ||
    (getRelatedRoleOverlap(userRoles, hackathonRoles) as string | null) ||
    user.primaryRoles?.[0] ||
    '참가자';

  return {
    matchRate: Math.min(95, score),
    suggestedRole,
    matchedRoles,
    matchedDomains,
    matchedSkills,
    missingSkills,
    roleDescription: ROLE_DESCRIPTIONS[suggestedRole] || '현재 프로필을 기준으로 이 해커톤에 기여할 수 있습니다.',
    neededTeamRoles: [...hackathonRoles].filter((role) => !userRoles.has(role)).slice(0, 3),
  };
}
