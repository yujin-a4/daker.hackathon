import type { CurrentUser, Hackathon } from '@/types';

export type MatchBucket =
  | 'product'
  | 'design'
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'ai'
  | 'data'
  | 'mobile'
  | 'devops'
  | 'security'
  | 'blockchain'
  | 'healthcare'
  | 'iot'
  | 'gaming'
  | 'opensource';

export const BUCKET_ALIASES: Record<MatchBucket, string[]> = {
  product: ['pm', 'po', 'product', 'planner', 'planning', '기획', '서비스기획', '서비스 기획', 'prd', 'notion', 'biz', 'business', 'startup', 'idea', 'strategy'],
  design: ['design', 'designer', 'ux', 'ui', 'figma', 'prototype', 'prototyping', 'redesign', '디자인', '디자이너', 'branding'],
  frontend: ['frontend', 'front-end', 'react', 'next', 'next.js', 'vue', 'nuxt', 'web', '웹', '퍼블리싱', 'typescript', 'javascript', 'tailwind'],
  backend: ['backend', 'back-end', 'server', 'api', 'db', 'database', 'node', 'node.js', 'spring', 'nest', 'fastapi', 'django', 'postgresql', 'mysql', '백엔드'],
  fullstack: ['fullstack', 'full-stack', '풀스택'],
  ai: ['ai', 'ml', 'llm', 'rag', 'prompt', 'genai', 'openai', 'langchain', 'pytorch', 'tensorflow', 'machine learning'],
  data: ['data', 'analytics', 'analysis', 'analyst', 'bi', 'sql', 'pandas', 'bigdata', '데이터', '분석'],
  mobile: ['mobile', 'android', 'ios', 'swift', 'kotlin', 'react native', 'flutter', '앱', '모바일'],
  devops: ['devops', 'infra', 'cloud', 'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'ci/cd', 'vercel', 'netlify', 'infra'],
  security: ['security', 'secure', 'ctf', '보안', '취약점', 'defense', 'cybersecurity'],
  blockchain: ['web3', 'blockchain', 'defi', 'solidity', 'crypto'],
  healthcare: ['bio', 'health', 'healthcare', 'medical', 'fhir', 'hospital', '헬스', '바이오'],
  iot: ['iot', 'embedded', 'sensor', 'hardware', 'smart home'],
  gaming: ['game', 'gaming', 'unity', 'roblox', 'metaverse'],
  opensource: ['opensource', 'open source', 'oss', 'github'],
};

export const RELATED_BUCKETS: Partial<Record<MatchBucket, MatchBucket[]>> = {
  product: ['design', 'frontend', 'data', 'ai'],
  design: ['product', 'frontend', 'mobile'],
  frontend: ['design', 'fullstack', 'backend', 'mobile'],
  backend: ['fullstack', 'devops', 'data', 'security', 'blockchain'],
  fullstack: ['frontend', 'backend', 'devops', 'mobile'],
  ai: ['data', 'backend', 'product', 'healthcare'],
  data: ['ai', 'backend', 'product', 'healthcare'],
  mobile: ['frontend', 'design', 'fullstack', 'iot'],
  devops: ['backend', 'security', 'fullstack'],
  security: ['backend', 'devops', 'blockchain', 'iot'],
  blockchain: ['backend', 'security'],
  healthcare: ['ai', 'data', 'product'],
  iot: ['mobile', 'backend', 'security'],
  gaming: ['design', 'frontend', 'product'],
  opensource: ['backend', 'frontend', 'devops'],
};

const TYPE_BUCKET_MAP: Array<{ bucket: MatchBucket; keywords: string[] }> = [
  { bucket: 'product', keywords: ['서비스기획', '서비스 기획', '기획', 'startup', 'business', 'idea', 'productivity', 'lowcode', 'nocode'] },
  { bucket: 'design', keywords: ['디자인', 'ux', 'ui', 'redesign'] },
  { bucket: 'frontend', keywords: ['web', 'sw개발', 'sw 개발'] },
  { bucket: 'backend', keywords: ['server', 'api', 'backend'] },
  { bucket: 'ai', keywords: ['데이터/ai', 'ai/ml', 'ai', 'ml', 'genai'] },
  { bucket: 'data', keywords: ['데이터', 'analysis', 'analytics', 'bigdata'] },
  { bucket: 'security', keywords: ['security', '보안'] },
  { bucket: 'blockchain', keywords: ['web3', 'blockchain', 'defi'] },
  { bucket: 'healthcare', keywords: ['health', 'bio', 'medical'] },
  { bucket: 'iot', keywords: ['iot', 'smart home'] },
  { bucket: 'gaming', keywords: ['gaming', 'metaverse', 'game'] },
  { bucket: 'opensource', keywords: ['opensource', 'oss'] },
];

export function normalize(value?: string | null) {
  return (value || '').toLowerCase().trim();
}

export function includesKeyword(texts: Array<string | undefined | null>, keyword: string) {
  const normalizedKeyword = normalize(keyword);
  return normalizedKeyword.length > 0 && texts.some((text) => normalize(text).includes(normalizedKeyword));
}

export function resolveBuckets(texts: Array<string | undefined | null>) {
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

export function getRelatedOverlap(sourceBuckets: Set<MatchBucket>, targetBuckets: Set<MatchBucket>) {
  for (const bucket of sourceBuckets) {
    const related = RELATED_BUCKETS[bucket] || [];
    if (related.some((candidate) => targetBuckets.has(candidate))) {
      return bucket;
    }
  }
  return null;
}

export function getUserMatchContext(user: CurrentUser) {
  return {
    texts: [user.role, ...(user.preferredTypes || []), ...(user.skills || [])],
    buckets: resolveBuckets([user.role, ...(user.preferredTypes || []), ...(user.skills || [])]),
  };
}

export function getHackathonMatchContext(hackathon: Hackathon) {
  const texts = [hackathon.title, hackathon.type, ...(hackathon.tags || [])];
  return {
    texts,
    buckets: resolveBuckets(texts),
  };
}
