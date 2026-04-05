import type { Hackathon, CurrentUser } from '@/types';
import { hasMatchingProfile } from '@/lib/user-profile';
import {
  getHackathonMatchContext,
  getRelatedOverlap,
  getUserMatchContext,
  includesKeyword,
  MatchBucket,
  resolveBuckets,
} from '@/lib/match-taxonomy';

export interface MatchAnalysisResult {
  matchRate: number;
  suggestedRole: string;
  matchedSkills: string[];
  missingSkills: string[];
  roleDescription: string;
  neededTeamRoles: string[];
}

const ROLE_LABELS: Partial<Record<MatchBucket, string>> = {
  product: '기획/PM',
  design: '디자인',
  frontend: '프론트엔드',
  backend: '백엔드',
  fullstack: '풀스택',
  ai: 'AI/ML',
  data: '데이터',
  mobile: '모바일',
  devops: 'DevOps',
  security: '보안',
  blockchain: '블록체인',
  healthcare: '헬스케어/바이오',
  iot: 'IoT',
  gaming: '게임',
  opensource: '오픈소스',
};

const ROLE_DESCRIPTIONS: Partial<Record<MatchBucket, string>> = {
  product: '문제 정의와 제품 방향 설정에 강점을 보일 수 있는 조합입니다.',
  design: '사용자 경험과 화면 설계 측면에서 기여도가 높을 가능성이 큽니다.',
  frontend: '인터페이스 구현과 웹 제품 완성도 측면에서 강점을 보일 수 있습니다.',
  backend: '서버 구조와 데이터 처리, API 설계 측면에서 잘 맞는 편입니다.',
  fullstack: '제품 구현 전반을 연결하는 역할로 기여하기 좋은 조합입니다.',
  ai: 'AI 기능 설계와 모델 활용 측면에서 강점을 살릴 수 있습니다.',
  data: '데이터 분석과 인사이트 도출이 중요한 문제에 잘 맞습니다.',
  mobile: '앱 경험 중심 프로젝트에서 강점이 드러날 가능성이 큽니다.',
  devops: '배포와 인프라, 운영 안정성이 중요한 프로젝트와 잘 맞습니다.',
  security: '보안과 신뢰성이 중요한 해커톤 주제에 적합한 편입니다.',
  blockchain: 'Web3, 지갑, 트랜잭션 흐름이 있는 프로젝트에 잘 맞습니다.',
  healthcare: '헬스케어/바이오 도메인 이해가 필요한 주제와 잘 맞습니다.',
  iot: '하드웨어, 센서, 디바이스 연동 성격의 주제와 잘 맞습니다.',
  gaming: '게임성, 인터랙션, 몰입형 경험이 중요한 주제에 적합합니다.',
  opensource: '개발 생산성과 협업 중심 프로젝트에 기여하기 좋은 조합입니다.',
};

function getTopBucket(user: CurrentUser, hackathon: Hackathon) {
  const userContext = getUserMatchContext(user);
  const hackathonContext = getHackathonMatchContext(hackathon);

  const direct = [...userContext.buckets].find((bucket) => hackathonContext.buckets.has(bucket));
  if (direct) return direct;

  const related = getRelatedOverlap(userContext.buckets, hackathonContext.buckets);
  if (related) return related;

  const roleBucket = resolveBuckets([user.role]);
  return [...roleBucket][0] || [...userContext.buckets][0] || 'frontend';
}

function getMatchedKeywords(user: CurrentUser, hackathon: Hackathon) {
  const hackathonTexts = getHackathonMatchContext(hackathon).texts;
  return (user.skills || []).filter((skill) => includesKeyword(hackathonTexts, skill));
}

function getMissingKeywords(user: CurrentUser, hackathon: Hackathon) {
  const userBuckets = getUserMatchContext(user).buckets;
  const hackathonBucketEntries = [...getHackathonMatchContext(hackathon).buckets];

  return hackathonBucketEntries
    .filter((bucket) => !userBuckets.has(bucket))
    .map((bucket) => ROLE_LABELS[bucket] || bucket)
    .slice(0, 4);
}

function getNeededRoles(user: CurrentUser, hackathon: Hackathon, suggestedBucket: MatchBucket) {
  const userBuckets = getUserMatchContext(user).buckets;
  const hackathonBuckets = getHackathonMatchContext(hackathon).buckets;

  return [...hackathonBuckets]
    .filter((bucket) => bucket !== suggestedBucket && !userBuckets.has(bucket))
    .map((bucket) => ROLE_LABELS[bucket] || bucket)
    .slice(0, 3);
}

export function analyzeHackathonMatch(hackathon: Hackathon, user: CurrentUser | null): MatchAnalysisResult | null {
  if (!user || !hasMatchingProfile(user)) return null;

  const userContext = getUserMatchContext(user);
  const hackathonContext = getHackathonMatchContext(hackathon);

  let score = 0;

  const directBuckets = [...userContext.buckets].filter((bucket) => hackathonContext.buckets.has(bucket));
  if (directBuckets.length > 0) {
    score += 55;
  } else if (getRelatedOverlap(userContext.buckets, hackathonContext.buckets)) {
    score += 35;
  }

  const preferredTypeBuckets = resolveBuckets(user.preferredTypes || []);
  const typeOverlap = [...preferredTypeBuckets].filter((bucket) => hackathonContext.buckets.has(bucket));
  if (typeOverlap.length > 0) {
    score += 25;
  } else if ((user.preferredTypes || []).some((item) => includesKeyword(hackathonContext.texts, item))) {
    score += 12;
  }

  const matchedSkills = getMatchedKeywords(user, hackathon);
  if (matchedSkills.length > 0) {
    score += Math.min(15, matchedSkills.length * 6);
  }

  if (user.role && includesKeyword(hackathonContext.texts, user.role)) {
    score += 10;
  }

  if (hackathon.status === 'recruiting') {
    score += 5;
  }

  const matchRate = Math.min(score, 95);
  const suggestedBucket = getTopBucket(user, hackathon);

  return {
    matchRate,
    suggestedRole: ROLE_LABELS[suggestedBucket] || user.role || '개발',
    matchedSkills,
    missingSkills: getMissingKeywords(user, hackathon),
    roleDescription: ROLE_DESCRIPTIONS[suggestedBucket] || '현재 프로필 기준으로 이 해커톤에서 기여할 여지가 있습니다.',
    neededTeamRoles: getNeededRoles(user, hackathon, suggestedBucket),
  };
}
