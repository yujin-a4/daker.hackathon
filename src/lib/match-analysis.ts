import type { Hackathon, CurrentUser } from '@/types';

export interface MatchAnalysisResult {
  matchRate: number;
  suggestedRole: string;
  matchedSkills: string[];
  missingSkills: string[];
  roleDescription: string;
  neededTeamRoles: string[];
}

const CATEGORY_MAP: Record<string, string[]> = {
  '프론트엔드': ['React', 'Next.js', 'Vue', 'Tailwind CSS', 'TypeScript', 'JavaScript', '웹 퍼블리싱', 'VibeCoding'],
  '백엔드': ['Node.js', 'Spring', 'Python', 'Database', 'SQL', 'Deep Learning', 'FastAPI', 'Django', 'Cloud', 'Vercel'],
  'AI/ML': ['LLM 이해', '프롬프트 엔지니어링', '제미나이 활용', 'Machine Learning', 'AI 아키텍처', 'GenAI', 'vLLM', 'Compression'],
  '디자인': ['UI/UX', 'Figma', '브랜딩', '그래픽 디자인', '3D', 'Unity', 'Framer', 'Prototyping'],
  '기획': ['기획', '마케팅', '데이터 분석', '전략', 'BM 수립', 'Startup', 'Business', 'Idea', 'Strategy', 'Notion', 'PRD 작성']
};

export function analyzeHackathonMatch(hackathon: Hackathon, user: CurrentUser | null): MatchAnalysisResult | null {
  if (!user) return null;

  const userSkills = user.skills || [];
  const hackathonTags = hackathon.tags || [];
  const userRole = user.role || '';
  const hackathonType = hackathon.type || '';

  // 1. 매칭률 계산 (기존 단순 태그 비교)
  const matchedSkills = hackathonTags.filter(tag => userSkills.includes(tag));
  const missingSkills = hackathonTags.filter(tag => !userSkills.includes(tag));
  
  // 기본 점수 계산 (태그 기반)
  let baseScore = matchedSkills.length > 0 
    ? Math.round((matchedSkills.length / hackathonTags.length) * 100) 
    : 0;

  // 보너스 점수 (직무/해커톤 타입 일치 시)
  // 예: 서비스기획자 == 서비스기회, SW개발 == 프론트엔드/백엔드
  let roleMatchBonus = 0;
  if (
    (userRole.includes('기획') && hackathonType.includes('기획')) ||
    (userRole.includes('개발') && hackathonType.includes('SW')) ||
    (userRole.includes('디자인') && hackathonType.includes('디자인')) ||
    (userRole.includes('ML') && hackathonType.includes('AI'))
  ) {
    roleMatchBonus = 40;
  }

  const matchRate = Math.min(95, baseScore + roleMatchBonus);

  // 2. 적합 역할 제안
  let suggestedRole = userRole || '참가자';
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

  // 3. 필요한 팀원 역할 분석
  const neededTeamRoles: string[] = [];
  Object.entries(CATEGORY_MAP).forEach(([category, skills]) => {
    if (category !== suggestedRole) {
      const hasMissingSkillInThisCategory = missingSkills.some(skill => skills.includes(skill));
      if (hasMissingSkillInThisCategory) {
        neededTeamRoles.push(category);
      }
    }
  });

  return {
    matchRate,
    suggestedRole,
    matchedSkills,
    missingSkills,
    roleDescription,
    neededTeamRoles: neededTeamRoles.length > 0 ? neededTeamRoles : ['개발자', '디자이너']
  };
}


