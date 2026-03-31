import type { Hackathon, CurrentUser } from '@/types';

export interface MatchAnalysisResult {
  matchRate: number;
  suggestedRole: string;
  matchedSkills: string[];
  missingSkills: string[];
  roleDescription: string;
}

const CATEGORY_MAP: Record<string, string[]> = {
  '프론트엔드': ['React', 'Next.js', 'Vue', 'Tailwind CSS', 'TypeScript', 'JavaScript', '웹 퍼블리싱'],
  '백엔드': ['Node.js', 'Spring', 'Python', 'Database', 'SQL', 'Deep Learning', 'FastAPI', 'Django'],
  'AI/ML': ['LLM 이해', '프롬프트 엔지니어링', '제미나이 활용', 'Machine Learning', 'AI 아키텍처'],
  '디자인': ['UI/UX', 'Figma', '브랜딩', '그래픽 디자인'],
  '기획': ['기획', '마케팅', '데이터 분석', '전략', 'BM 수립']
};

export function analyzeHackathonMatch(hackathon: Hackathon, user: CurrentUser | null): MatchAnalysisResult | null {
  if (!user) return null;

  const userSkills = user.skills || [];
  const hackathonTags = hackathon.tags || [];

  if (hackathonTags.length === 0) return null;

  // 1. 매칭률 계산
  const matchedSkills = hackathonTags.filter(tag => userSkills.includes(tag));
  const missingSkills = hackathonTags.filter(tag => !userSkills.includes(tag));
  const matchRate = Math.round((matchedSkills.length / hackathonTags.length) * 100);

  // 2. 적합 역할 제안
  let suggestedRole = '참가자';
  let roleDescription = '다양한 분야에서 활약할 수 있는 올라운더입니다.';
  let maxMatchCount = -1;

  Object.entries(CATEGORY_MAP).forEach(([category, skills]) => {
    const count = userSkills.filter(s => skills.includes(s)).length;
    if (count > maxMatchCount) {
      maxMatchCount = count;
      suggestedRole = category;
    }
  });

  if (suggestedRole === '프론트엔드') roleDescription = '강력한 기술 스택으로 매끄러운 유저 경험을 설계할 수 있습니다.';
  if (suggestedRole === '백엔드') roleDescription = '안정적인 인프라와 데이터 로직으로 대회 결과물의 완성도를 높입니다.';
  if (suggestedRole === 'AI/ML') roleDescription = '최신 엔진과 프롬프트 전략으로 해커톤의 혁신성을 주도할 수 있습니다.';
  if (suggestedRole === '디자인') roleDescription = '감각적인 비주얼로 프로젝트의 첫인상을 압도적으로 만듭니다.';
  if (suggestedRole === '기획') roleDescription = '날카로운 분석과 논리로 프로젝트의 비즈니스 가치를 설득합니다.';

  return {
    matchRate,
    suggestedRole,
    matchedSkills,
    missingSkills,
    roleDescription
  };
}
