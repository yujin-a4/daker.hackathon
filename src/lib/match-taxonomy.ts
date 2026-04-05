import type { CurrentUser, Hackathon, Team } from '@/types';

export const PRIMARY_ROLE_OPTIONS = [
  '기획',
  '디자인',
  '프론트엔드',
  '백엔드',
  '풀스택',
  '모바일',
  'AI 개발',
  '데이터',
  'DevOps',
  '보안',
] as const;

export const INTEREST_DOMAIN_OPTIONS = [
  'AI/LLM',
  '데이터',
  '생산성',
  '핀테크',
  '헬스케어',
  '교육',
  '커머스',
  '게임',
  '웹3',
  '보안',
  '공공/사회문제',
  'ESG/환경',
  'IoT/하드웨어',
  '오픈소스',
] as const;

export const TECH_STACK_OPTIONS = [
  'React',
  'Next.js',
  'Vue',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Node.js',
  'NestJS',
  'Spring Boot',
  'FastAPI',
  'Django',
  'Flutter',
  'React Native',
  'Swift',
  'Kotlin',
  'Python',
  'PyTorch',
  'TensorFlow',
  'Pandas',
  'SQL',
  'LangChain',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'GraphQL',
  'AWS',
  'GCP',
  'Docker',
  'Kubernetes',
  'Firebase',
  'Supabase',
  'Figma',
  'Framer',
] as const;

export const COLLABORATION_STRENGTH_OPTIONS = [
  'PRD 작성',
  '문제 정의',
  '사용자 리서치',
  'UX 라이팅',
  '프로토타이핑',
  '프로젝트 관리',
  '문서화',
  '발표/피칭',
  '시장조사',
  '데이터 해석',
  '커뮤니케이션',
] as const;

export type PrimaryRole = (typeof PRIMARY_ROLE_OPTIONS)[number];
export type InterestDomain = (typeof INTEREST_DOMAIN_OPTIONS)[number];
export type TechStack = (typeof TECH_STACK_OPTIONS)[number];
export type CollaborationStrength = (typeof COLLABORATION_STRENGTH_OPTIONS)[number];

export interface SkillCategory {
  name: string;
  items: readonly string[];
}

export const TECH_STACK_CATEGORIES: SkillCategory[] = [
  { name: 'Frontend', items: ['React', 'Next.js', 'Vue', 'TypeScript', 'JavaScript', 'Tailwind CSS'] },
  { name: 'Backend', items: ['Node.js', 'NestJS', 'Spring Boot', 'FastAPI', 'Django'] },
  { name: 'Mobile', items: ['Flutter', 'React Native', 'Swift', 'Kotlin'] },
  { name: 'AI/Data', items: ['Python', 'PyTorch', 'TensorFlow', 'Pandas', 'SQL', 'LangChain'] },
  { name: 'Database', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL'] },
  { name: 'Infra', items: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Firebase', 'Supabase'] },
  { name: 'Design Tools', items: ['Figma', 'Framer'] },
];

export const COLLABORATION_CATEGORIES: SkillCategory[] = [
  { name: 'Discovery', items: ['문제 정의', '사용자 리서치', '시장조사', '데이터 해석'] },
  { name: 'Planning', items: ['PRD 작성', '프로젝트 관리', '문서화'] },
  { name: 'Execution', items: ['프로토타이핑', 'UX 라이팅', '커뮤니케이션'] },
  { name: 'Delivery', items: ['발표/피칭'] },
];

type KeywordEntry<T extends string> = {
  value: T;
  keywords: string[];
};

const ROLE_KEYWORDS: KeywordEntry<PrimaryRole>[] = [
  {
    value: '기획',
    keywords: ['pm', 'po', 'product', 'planner', 'planning', 'strategy', 'startup founder', 'growth hacker', '서비스기획', '서비스기획자', '기획'],
  },
  {
    value: '디자인',
    keywords: ['design', 'designer', 'ux', 'ui', 'graphic', 'figma', 'branding', '브랜딩', '디자인', '프로토타이핑'],
  },
  {
    value: '프론트엔드',
    keywords: ['frontend', 'front-end', 'react', 'next', 'vue', 'web', 'typescript', 'javascript', '프론트'],
  },
  {
    value: '백엔드',
    keywords: ['backend', 'back-end', 'server', 'api', 'database', 'node', 'spring', 'fastapi', 'django', '백엔드'],
  },
  { value: '풀스택', keywords: ['fullstack', 'full-stack', '풀스택'] },
  { value: '모바일', keywords: ['mobile', 'android', 'ios', 'swift', 'kotlin', 'react native', 'flutter', '모바일'] },
  { value: 'AI 개발', keywords: ['ai', 'llm', 'ml', 'mlops', 'researcher', 'langchain', 'rag', 'openai', 'ai 개발'] },
  { value: '데이터', keywords: ['data', 'analytics', 'analysis', 'scientist', 'engineer', 'analyst', 'sql', 'pandas', 'tableau', 'spark', 'kafka', '데이터'] },
  { value: 'DevOps', keywords: ['devops', 'infra', 'cloud', 'aws', 'gcp', 'docker', 'kubernetes', 'sre', 'infrastructure'] },
  { value: '보안', keywords: ['security', 'ctf', 'cyber', 'firewall', 'penetration', '보안'] },
];

const DOMAIN_KEYWORDS: KeywordEntry<InterestDomain>[] = [
  { value: 'AI/LLM', keywords: ['ai', 'llm', 'genai', 'ml', 'rag', 'openai'] },
  { value: '데이터', keywords: ['data', 'analytics', 'analysis', 'bigdata', 'sql'] },
  { value: '생산성', keywords: ['productivity', 'workflow', 'automation', 'collaboration', 'lowcode', 'nocode'] },
  { value: '핀테크', keywords: ['fintech', 'finance', 'payment', 'banking', 'stripe'] },
  { value: '헬스케어', keywords: ['health', 'healthcare', 'medical', 'bio', 'hospital', 'fhir', 'hl7'] },
  { value: '교육', keywords: ['education', 'learning', 'student', 'course', '교육'] },
  { value: '커머스', keywords: ['commerce', 'shopping', 'retail', 'marketplace'] },
  { value: '게임', keywords: ['game', 'gaming', 'unity', 'metaverse', 'roblox'] },
  { value: '웹3', keywords: ['web3', 'blockchain', 'defi', 'crypto', 'solidity'] },
  { value: '보안', keywords: ['security', 'ctf', 'cyber', 'defense', 'firewall'] },
  { value: '공공/사회문제', keywords: ['public', 'government', 'social', 'civic', 'publicdata', '사회문제'] },
  { value: 'ESG/환경', keywords: ['esg', 'environment', 'green', 'sustainability', 'zero waste'] },
  { value: 'IoT/하드웨어', keywords: ['iot', 'hardware', 'embedded', 'sensor', 'smart home'] },
  { value: '오픈소스', keywords: ['opensource', 'open source', 'oss', 'github'] },
];

const TECH_KEYWORDS: KeywordEntry<TechStack>[] = [
  { value: 'React', keywords: ['react'] },
  { value: 'Next.js', keywords: ['next.js', 'nextjs'] },
  { value: 'Vue', keywords: ['vue'] },
  { value: 'TypeScript', keywords: ['typescript'] },
  { value: 'JavaScript', keywords: ['javascript'] },
  { value: 'Tailwind CSS', keywords: ['tailwind', 'tailwind css'] },
  { value: 'Node.js', keywords: ['node.js', 'nodejs', 'node'] },
  { value: 'NestJS', keywords: ['nestjs', 'nest.js'] },
  { value: 'Spring Boot', keywords: ['spring boot', 'spring'] },
  { value: 'FastAPI', keywords: ['fastapi'] },
  { value: 'Django', keywords: ['django'] },
  { value: 'Flutter', keywords: ['flutter'] },
  { value: 'React Native', keywords: ['react native'] },
  { value: 'Swift', keywords: ['swift'] },
  { value: 'Kotlin', keywords: ['kotlin'] },
  { value: 'Python', keywords: ['python'] },
  { value: 'PyTorch', keywords: ['pytorch'] },
  { value: 'TensorFlow', keywords: ['tensorflow'] },
  { value: 'Pandas', keywords: ['pandas'] },
  { value: 'SQL', keywords: ['sql'] },
  { value: 'LangChain', keywords: ['langchain', 'llm'] },
  { value: 'PostgreSQL', keywords: ['postgresql', 'postgres'] },
  { value: 'MySQL', keywords: ['mysql'] },
  { value: 'MongoDB', keywords: ['mongodb', 'mongo'] },
  { value: 'Redis', keywords: ['redis'] },
  { value: 'GraphQL', keywords: ['graphql'] },
  { value: 'AWS', keywords: ['aws'] },
  { value: 'GCP', keywords: ['gcp'] },
  { value: 'Docker', keywords: ['docker'] },
  { value: 'Kubernetes', keywords: ['kubernetes', 'k8s'] },
  { value: 'Firebase', keywords: ['firebase'] },
  { value: 'Supabase', keywords: ['supabase'] },
  { value: 'Figma', keywords: ['figma'] },
  { value: 'Framer', keywords: ['framer'] },
];

const COLLAB_KEYWORDS: KeywordEntry<CollaborationStrength>[] = [
  { value: 'PRD 작성', keywords: ['prd', 'requirements', 'prd작성'] },
  { value: '문제 정의', keywords: ['problem framing', 'problem definition', '문제 정의'] },
  { value: '사용자 리서치', keywords: ['user research', 'research', '리서치'] },
  { value: 'UX 라이팅', keywords: ['ux writing', 'copywriting', 'ux라이팅'] },
  { value: '프로토타이핑', keywords: ['prototype', 'prototyping', '프로토타이핑'] },
  { value: '프로젝트 관리', keywords: ['project management', 'agile', 'scrum'] },
  { value: '문서화', keywords: ['documentation', 'docs', 'notion', '문서화'] },
  { value: '발표/피칭', keywords: ['pitch', 'presentation', 'deck', '피칭', '발표'] },
  { value: '시장조사', keywords: ['market research', 'go-to-market', '시장조사'] },
  { value: '데이터 해석', keywords: ['analytics', 'insight', '데이터 해석'] },
  { value: '커뮤니케이션', keywords: ['communication', 'facilitation', '커뮤니케이션'] },
];

export const RELATED_ROLES: Partial<Record<PrimaryRole, PrimaryRole[]>> = {
  '기획': ['디자인', '프론트엔드', '데이터', 'AI 개발'],
  '디자인': ['기획', '프론트엔드', '모바일'],
  '프론트엔드': ['디자인', '풀스택', '모바일'],
  '백엔드': ['풀스택', 'DevOps', '데이터', '보안'],
  '풀스택': ['프론트엔드', '백엔드', 'DevOps', '모바일'],
  '모바일': ['프론트엔드', '디자인', '풀스택'],
  'AI 개발': ['데이터', '백엔드'],
  '데이터': ['AI 개발', '백엔드', '기획'],
  'DevOps': ['백엔드', '보안', '풀스택'],
  '보안': ['백엔드', 'DevOps'],
};

const LEGACY_ROLE_TO_PRIMARY: Array<{ match: string[]; value: PrimaryRole[] }> = [
  { match: ['frontend'], value: ['프론트엔드'] },
  { match: ['backend'], value: ['백엔드'] },
  { match: ['ux designer', 'graphic designer', 'designer'], value: ['디자인'] },
  { match: ['pm', 'po', 'product', '서비스기획', '기획'], value: ['기획'] },
  { match: ['fullstack'], value: ['풀스택'] },
  { match: ['mobile'], value: ['모바일'] },
  { match: ['ai', 'ml'], value: ['AI 개발'] },
  { match: ['data'], value: ['데이터'] },
  { match: ['devops', 'cloud', 'sre'], value: ['DevOps'] },
  { match: ['security'], value: ['보안'] },
];

const LEGACY_TYPE_TO_DOMAIN: Array<{ match: string[]; value: InterestDomain[] }> = [
  { match: ['ai/ml'], value: ['AI/LLM'] },
  { match: ['데이터'], value: ['데이터'] },
  { match: ['보안'], value: ['보안'] },
  { match: ['서비스기획'], value: ['생산성'] },
];

function normalize(value?: string | null) {
  return (value || '').toLowerCase().trim();
}

function dedupe<T extends string>(items: T[]) {
  return Array.from(new Set(items));
}

function textIncludes(texts: Array<string | undefined | null>, keyword: string) {
  const normalizedKeyword = normalize(keyword);
  return normalizedKeyword.length > 0 && texts.some((text) => normalize(text).includes(normalizedKeyword));
}

function collectEntryMatches<T extends string>(texts: Array<string | undefined | null>, entries: KeywordEntry<T>[]) {
  return dedupe(
    entries
      .filter((entry) => entry.keywords.some((keyword) => textIncludes(texts, keyword)))
      .map((entry) => entry.value)
  );
}

export function includesKeyword(texts: Array<string | undefined | null>, keyword: string) {
  return textIncludes(texts, keyword);
}

export function getUserRoleSet(user: Pick<CurrentUser, 'primaryRoles'>) {
  return new Set((user.primaryRoles || []).filter(Boolean) as PrimaryRole[]);
}

export function getUserDomainSet(user: Pick<CurrentUser, 'interestDomains'>) {
  return new Set((user.interestDomains || []).filter(Boolean) as InterestDomain[]);
}

export function getUserTechSet(user: Pick<CurrentUser, 'techStacks'>) {
  return new Set((user.techStacks || []).filter(Boolean) as TechStack[]);
}

export function getUserCollaborationSet(user: Pick<CurrentUser, 'collaborationStrengths'>) {
  return new Set((user.collaborationStrengths || []).filter(Boolean) as CollaborationStrength[]);
}

export function getRoleOverlap(userRoles: Set<PrimaryRole>, targetRoles: Set<PrimaryRole>) {
  return [...userRoles].filter((role) => targetRoles.has(role));
}

export function getRelatedRoleOverlap(userRoles: Set<PrimaryRole>, targetRoles: Set<PrimaryRole>) {
  for (const role of userRoles) {
    const related = RELATED_ROLES[role] || [];
    if (related.some((candidate) => targetRoles.has(candidate))) {
      return role;
    }
  }
  return null;
}

export function getHackathonDomainSet(hackathon: Hackathon) {
  return new Set(collectEntryMatches([hackathon.title, hackathon.type, ...(hackathon.tags || [])], DOMAIN_KEYWORDS));
}

export function getHackathonRoleSet(hackathon: Hackathon) {
  return new Set(collectEntryMatches([hackathon.title, hackathon.type, ...(hackathon.tags || [])], ROLE_KEYWORDS));
}

export function getHackathonTechSet(hackathon: Hackathon) {
  return new Set(collectEntryMatches([hackathon.title, hackathon.type, ...(hackathon.tags || [])], TECH_KEYWORDS));
}

export function getTeamRoleSet(team: Team, hackathon?: Hackathon | null) {
  const texts = [team.name, team.intro, ...team.lookingFor.flatMap((item) => [item.position, item.description])];
  if (hackathon) texts.push(hackathon.title, hackathon.type, ...(hackathon.tags || []));
  return new Set(collectEntryMatches(texts, ROLE_KEYWORDS));
}

export function getTeamTechSet(team: Team, hackathon?: Hackathon | null) {
  const texts = [team.name, team.intro, ...team.lookingFor.flatMap((item) => [item.position, item.description])];
  if (hackathon) texts.push(hackathon.title, hackathon.type, ...(hackathon.tags || []));
  return new Set(collectEntryMatches(texts, TECH_KEYWORDS));
}

export function getTeamDomainSet(team: Team, hackathon?: Hackathon | null) {
  const texts = [team.name, team.intro, ...team.lookingFor.flatMap((item) => [item.position, item.description])];
  if (hackathon) texts.push(hackathon.title, hackathon.type, ...(hackathon.tags || []));
  return new Set(collectEntryMatches(texts, DOMAIN_KEYWORDS));
}

export function getTeamCollaborationSet(team: Team) {
  return new Set(
    collectEntryMatches(
      [team.name, team.intro, ...team.lookingFor.flatMap((item) => [item.position, item.description])],
      COLLAB_KEYWORDS
    )
  );
}

export function mapLegacyRoleToPrimaryRoles(role?: string | null) {
  const normalized = normalize(role);
  if (!normalized) return [];
  for (const entry of LEGACY_ROLE_TO_PRIMARY) {
    if (entry.match.some((token) => normalized.includes(token))) {
      return entry.value;
    }
  }
  return collectEntryMatches([role], ROLE_KEYWORDS);
}

export function mapLegacyPreferredTypesToInterestDomains(preferredTypes?: string[]) {
  const matches: InterestDomain[] = [];
  (preferredTypes || []).forEach((item) => {
    const normalized = normalize(item);
    const mapped = LEGACY_TYPE_TO_DOMAIN.find((entry) => entry.match.some((token) => normalized.includes(token)));
    if (mapped) {
      matches.push(...mapped.value);
      return;
    }
    matches.push(...collectEntryMatches([item], DOMAIN_KEYWORDS));
  });
  return dedupe(matches);
}

export function splitLegacySkills(skills?: string[]) {
  return {
    techStacks: collectEntryMatches(skills || [], TECH_KEYWORDS),
    collaborationStrengths: collectEntryMatches(skills || [], COLLAB_KEYWORDS),
    interestDomains: collectEntryMatches(skills || [], DOMAIN_KEYWORDS),
  };
}

export function describePrimaryRoles(roles?: string[]) {
  if (!roles || roles.length === 0) return '';
  return roles.join(', ');
}
