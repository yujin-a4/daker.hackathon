import type { CurrentUser, Team } from '@/types';
import { useHackathonStore } from '@/store/useHackathonStore';

export interface MatchingResult {
  team: Team;
  score: number;
  matchReasons: string[];
}

type MatchBucket =
  | 'product'
  | 'design'
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'ai'
  | 'data'
  | 'mobile'
  | 'devops'
  | 'security';

const BUCKET_ALIASES: Record<MatchBucket, string[]> = {
  product: ['pm', 'po', 'product', 'planner', 'planning', '기획', '서비스기획', '서비스 기획', 'prd', 'notion', 'biz', 'business'],
  design: ['design', 'designer', 'ux', 'ui', 'figma', 'prototype', 'prototyping', '디자인', '디자이너'],
  frontend: ['frontend', 'front-end', 'react', 'next', 'vue', 'web', '퍼블리싱', '프론트'],
  backend: ['backend', 'back-end', 'server', 'api', 'db', 'database', 'spring', 'nest', 'fastapi', '백엔드'],
  fullstack: ['fullstack', 'full-stack', '풀스택'],
  ai: ['ai', 'ml', 'llm', 'rag', 'prompt', 'genai', 'openai', 'langchain', 'pytorch', 'tensorflow'],
  data: ['data', 'analytics', 'analysis', 'analyst', 'bi', 'sql', 'pandas', '데이터', '분석'],
  mobile: ['mobile', 'android', 'ios', 'swift', 'kotlin', 'react native', 'flutter'],
  devops: ['devops', 'infra', 'cloud', 'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'ci/cd'],
  security: ['security', 'secure', 'ctf', '보안', '취약점'],
};

const RELATED_BUCKETS: Partial<Record<MatchBucket, MatchBucket[]>> = {
  product: ['design', 'frontend', 'data'],
  design: ['product', 'frontend'],
  frontend: ['design', 'fullstack', 'backend'],
  backend: ['fullstack', 'devops', 'data', 'security'],
  fullstack: ['frontend', 'backend', 'devops'],
  ai: ['data', 'backend', 'product'],
  data: ['ai', 'backend', 'product'],
  mobile: ['frontend', 'design'],
  devops: ['backend', 'security', 'fullstack'],
  security: ['backend', 'devops'],
};

const TYPE_BUCKET_MAP: Array<{ bucket: MatchBucket; keywords: string[] }> = [
  { bucket: 'product', keywords: ['서비스기획', '서비스 기획', '기획', 'startup', 'business', 'idea', 'productivity', 'lowcode', 'nocode'] },
  { bucket: 'design', keywords: ['디자인', 'ux', 'ui', 'redesign'] },
  { bucket: 'frontend', keywords: ['web', 'sw개발', 'sw 개발'] },
  { bucket: 'backend', keywords: ['server', 'api', 'backend'] },
  { bucket: 'ai', keywords: ['데이터/ai', 'ai/ml', 'ai', 'ml', 'genai'] },
  { bucket: 'data', keywords: ['데이터', 'analysis', 'analytics', 'bigdata'] },
  { bucket: 'security', keywords: ['security', '보안'] },
];

function normalize(value?: string | null) {
  return (value || '').toLowerCase().trim();
}

function includesKeyword(texts: Array<string | undefined | null>, keyword: string) {
  const normalizedKeyword = normalize(keyword);
  return normalizedKeyword.length > 0 && texts.some((text) => normalize(text).includes(normalizedKeyword));
}

function resolveBuckets(texts: Array<string | undefined | null>) {
  const normalizedTexts = texts.map((text) => normalize(text)).filter(Boolean);
  const buckets = new Set<MatchBucket>();

  (Object.entries(BUCKET_ALIASES) as Array<[MatchBucket, string[]]>).forEach(([bucket, aliases]) => {
    if (aliases.some((alias) => includesKeyword(normalizedTexts, alias))) {
      buckets.add(bucket);
    }
  });

  TYPE_BUCKET_MAP.forEach(({ bucket, keywords }) => {
    if (keywords.some((keyword) => includesKeyword(normalizedTexts, keyword))) {
      buckets.add(bucket);
    }
  });

  return buckets;
}

function getHackathonContext(team: Team) {
  if (!team.hackathonSlug) return null;
  const hackathon = useHackathonStore
    .getState()
    .hackathons.find((item) => item.slug === team.hackathonSlug);

  if (!hackathon) return null;

  return {
    type: hackathon.type,
    tags: hackathon.tags || [],
    title: hackathon.title,
  };
}

function getRelatedOverlap(userBuckets: Set<MatchBucket>, targetBuckets: Set<MatchBucket>) {
  for (const bucket of userBuckets) {
    const related = RELATED_BUCKETS[bucket] || [];
    if (related.some((candidate) => targetBuckets.has(candidate))) {
      return bucket;
    }
  }
  return null;
}

export function calculateMatchScore(user: CurrentUser, team: Team): MatchingResult {
  let score = 0;
  const matchReasons: string[] = [];
  const hackathon = getHackathonContext(team);

  const teamRoleTexts = team.lookingFor.flatMap((item) => [item.position, item.description]);
  const hackathonTexts = [hackathon?.title, hackathon?.type, ...(hackathon?.tags || [])];
  const teamContextTexts = [team.intro, ...teamRoleTexts, ...hackathonTexts];

  const userBuckets = resolveBuckets([
    user.role,
    ...(user.preferredTypes || []),
    ...(user.skills || []),
  ]);
  const teamRoleBuckets = resolveBuckets(teamRoleTexts);
  const hackathonBuckets = resolveBuckets(hackathonTexts);

  const directRoleBuckets = [...userBuckets].filter((bucket) => teamRoleBuckets.has(bucket));
  if (directRoleBuckets.length > 0) {
    score += 40;
    matchReasons.push(`팀이 ${user.role || '회원님 역량'}과 직접 맞닿은 포지션을 찾고 있어요`);
  } else if (userBuckets.size > 0 && teamRoleBuckets.size > 0) {
    const relatedBucket = getRelatedOverlap(userBuckets, teamRoleBuckets);
    if (relatedBucket) {
      score += 22;
      matchReasons.push('현재 모집 포지션과 협업 시너지가 좋은 팀이에요');
    }
  }

  const matchedSkills = (user.skills || []).filter((skill) => includesKeyword(teamContextTexts, skill));
  if (matchedSkills.length > 0) {
    score += Math.min(24, matchedSkills.length * 12);
    matchReasons.push(`${matchedSkills.slice(0, 2).join(', ')} 경험을 바로 활용할 수 있어요`);
  } else {
    const skillBuckets = resolveBuckets(user.skills || []);
    const skillBucketOverlap = [...skillBuckets].filter(
      (bucket) => teamRoleBuckets.has(bucket) || hackathonBuckets.has(bucket)
    );
    if (skillBucketOverlap.length > 0) {
      score += 14;
      matchReasons.push('보유 스킬 성향이 팀이 만드는 방향과 잘 맞아요');
    }
  }

  const preferredTypeBuckets = resolveBuckets(user.preferredTypes || []);
  const preferredOverlap = [...preferredTypeBuckets].filter((bucket) => hackathonBuckets.has(bucket));
  if (preferredOverlap.length > 0) {
    score += 20;
    matchReasons.push(`${hackathon?.type || '관심 분야'} 성격의 해커톤이라 선호도와 맞아요`);
  }

  const explicitInterestOverlap = (user.preferredTypes || []).some((pref) => includesKeyword(hackathonTexts, pref));
  if (explicitInterestOverlap && preferredOverlap.length === 0) {
    score += 10;
    matchReasons.push('선호 분야 키워드가 해커톤 주제와 겹쳐요');
  }

  if (team.isOpen && score > 0) {
    score += 8;
    if (team.memberCount >= team.maxTeamSize - 1) {
      matchReasons.push('곧 모집 마감이라 빠르게 합류 판단하기 좋아요');
    }
  }

  const finalScore = Math.min(score, 100);
  return { team, score: finalScore, matchReasons: matchReasons.slice(0, 3) };
}

export function getRecommendedTeams(user: CurrentUser, allTeams: Team[], limit: number = 3): MatchingResult[] {
  return allTeams
    .filter((team) => !team.isSolo && team.isOpen && !user.teamCodes.includes(team.teamCode))
    .map((team) => calculateMatchScore(user, team))
    .filter((result) => result.score >= 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
