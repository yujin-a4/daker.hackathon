'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowLeft, Save, X, Search, Check } from 'lucide-react';

const TYPE_OPTIONS = ['SW개발', '데이터/AI', '서비스기획', '디자인/UX', '종합'];

interface SkillGroup {
  name: string;
  items: string[];
}

interface SkillCategory {
  name: string;
  icon: string;
  groups: SkillGroup[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: '프론트엔드',
    icon: '🖥️',
    groups: [
      { name: '프레임워크', items: ['React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular', 'Svelte'] },
      { name: '언어/스타일', items: ['TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'SASS/SCSS'] },
      { name: '상태관리', items: ['Redux', 'Zustand', 'Recoil', 'Jotai', 'React Query'] },
    ],
  },
  {
    name: '모바일',
    icon: '📱',
    groups: [
      { name: '크로스플랫폼', items: ['Flutter', 'React Native', 'Expo'] },
      { name: 'iOS', items: ['Swift', 'SwiftUI', 'Objective-C'] },
      { name: 'Android', items: ['Kotlin', 'Jetpack Compose', 'Java(Android)'] },
    ],
  },
  {
    name: '백엔드',
    icon: '⚙️',
    groups: [
      { name: 'JS/TS', items: ['Node.js', 'Express', 'NestJS', 'Fastify'] },
      { name: 'Java/Kotlin', items: ['Spring', 'Spring Boot', 'Ktor'] },
      { name: 'Python', items: ['Django', 'FastAPI', 'Flask'] },
      { name: '기타 언어', items: ['Go', 'Rust', 'C#/.NET', 'PHP', 'Ruby'] },
    ],
  },
  {
    name: '데이터/AI',
    icon: '🤖',
    groups: [
      { name: 'ML/DL 프레임워크', items: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Hugging Face'] },
      { name: '데이터 처리', items: ['Pandas', 'NumPy', 'Spark', '데이터분석', '시계열분석', '시각화'] },
      { name: 'AI/LLM', items: ['OpenAI API', 'LangChain', 'RAG', 'LLM', 'NLP', '컴퓨터비전', 'MLOps'] },
    ],
  },
  {
    name: '데이터베이스',
    icon: '🗄️',
    groups: [
      { name: 'RDB', items: ['PostgreSQL', 'MySQL', 'Oracle', 'SQLite'] },
      { name: 'NoSQL', items: ['MongoDB', 'Redis', 'DynamoDB', 'Elasticsearch'] },
      { name: 'BaaS/ORM', items: ['Supabase', 'Firebase', 'Prisma', 'TypeORM'] },
      { name: 'API', items: ['REST API', 'GraphQL', 'gRPC', 'tRPC'] },
    ],
  },
  {
    name: '인프라/DevOps',
    icon: '☁️',
    groups: [
      { name: '클라우드', items: ['AWS', 'GCP', 'Azure', 'Vercel', 'Netlify', 'Cloudflare'] },
      { name: '컨테이너/IaC', items: ['Docker', 'Kubernetes', 'Terraform', 'Ansible'] },
      { name: 'CI/CD', items: ['GitHub Actions', 'Jenkins', 'GitLab CI', 'CI/CD'] },
      { name: '운영', items: ['Linux', 'Nginx', '모니터링', '로깅'] },
    ],
  },
  {
    name: '디자인/UX',
    icon: '🎨',
    groups: [
      { name: '도구', items: ['Figma', 'Adobe XD', 'Sketch', 'Framer'] },
      { name: '그래픽', items: ['Photoshop', 'Illustrator', 'After Effects', 'Blender'] },
      { name: '역량', items: ['UI/UX', 'UX리서치', '프로토타이핑', '디자인시스템', '모션디자인', '인터랙션디자인'] },
    ],
  },
  {
    name: '기획/비즈니스',
    icon: '📋',
    groups: [
      { name: '서비스기획', items: ['서비스기획', 'PM', 'PO', '요구사항분석', 'UX라이팅'] },
      { name: '전략/분석', items: ['사업계획서', '시장조사', '데이터기반의사결정', '사용자리서치', '경쟁분석'] },
      { name: '방법론', items: ['애자일/스크럼', '린스타트업', 'OKR', '디자인씽킹'] },
    ],
  },
  {
    name: '기타/도메인',
    icon: '🔧',
    groups: [
      { name: '버전관리', items: ['Git', 'GitHub', 'GitLab'] },
      { name: '도메인', items: ['Blockchain', 'Web3', 'IoT', '임베디드', '보안', '센서데이터', '스마트시티', '헬스케어', '핀테크', '교육', '바이브코딩'] },
    ],
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const currentUser = useUserStore((s) => s.currentUser);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const { hackathons } = useHackathonStore();

  const [nickname, setNickname] = useState('');
  const [preferredTypes, setPreferredTypes] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState(SKILL_CATEGORIES[0].name);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // 해커톤 태그 중 카테고리에 없는 것들을 기타/도메인에 추가
  const enrichedCategories = useMemo(() => {
    const allCategorized = new Set(SKILL_CATEGORIES.flatMap((c) => c.groups.flatMap((g) => g.items)));
    const extraTags: string[] = [];
    hackathons.forEach((h) => {
      h.tags?.forEach((tag) => {
        if (!allCategorized.has(tag)) extraTags.push(tag);
      });
    });
    const uniqueExtras = Array.from(new Set(extraTags)).sort((a, b) => a.localeCompare(b, 'ko'));

    if (uniqueExtras.length === 0) return SKILL_CATEGORIES;

    return SKILL_CATEGORIES.map((cat) => {
      if (cat.name === '기타/도메인') {
        return {
          ...cat,
          groups: [
            ...cat.groups,
            { name: '해커톤 태그', items: uniqueExtras },
          ],
        };
      }
      return cat;
    });
  }, [hackathons]);

  const activeCategoryData = enrichedCategories.find((c) => c.name === activeCategory);

  // 검색 결과
  const searchResults = useMemo(() => {
    if (!skillSearch.trim()) return null;
    const query = skillSearch.toLowerCase();
    const results: { category: string; group: string; skill: string }[] = [];
    enrichedCategories.forEach((cat) => {
      cat.groups.forEach((group) => {
        group.items.forEach((skill) => {
          if (skill.toLowerCase().includes(query)) {
            results.push({ category: cat.name, group: group.name, skill });
          }
        });
      });
    });
    return results;
  }, [skillSearch, enrichedCategories]);

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
      return;
    }
    setNickname(currentUser.nickname);
    setPreferredTypes(currentUser.preferredTypes || []);
    setSkills(currentUser.skills || []);
  }, [currentUser, router]);

  // 카테고리 바뀌면 첫 번째 그룹 자동 선택
  useEffect(() => {
    if (activeCategoryData && activeCategoryData.groups.length > 0) {
      setActiveGroup(activeCategoryData.groups[0].name);
    }
  }, [activeCategory, activeCategoryData]);

  if (!currentUser) return null;

  const toggleType = (type: string) => {
    setPreferredTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills((prev) => prev.filter((s) => s !== skill));
    } else {
      if (skills.length >= 15) {
        toast({ title: '스킬은 최대 15개까지 선택할 수 있습니다.', variant: 'destructive' });
        return;
      }
      setSkills((prev) => [...prev, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSave = () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname || trimmedNickname.length < 2 || trimmedNickname.length > 12) {
      toast({ title: '닉네임은 2~12자로 입력해주세요.', variant: 'destructive' });
      return;
    }
    updateProfile({ nickname: trimmedNickname, preferredTypes, skills });
    toast({
      title: '프로필이 저장되었습니다.',
      description: '선호 유형과 스킬 기반으로 해커톤을 추천받을 수 있습니다.',
    });
    router.push('/mypage');
  };

  const hasChanges =
    nickname !== currentUser.nickname ||
    JSON.stringify(preferredTypes) !== JSON.stringify(currentUser.preferredTypes || []) ||
    JSON.stringify(skills) !== JSON.stringify(currentUser.skills || []);

  const activeGroupData = activeCategoryData?.groups.find((g) => g.name === activeGroup);

  // 카테고리별 선택 수
  const getSelectedCount = (catName: string) => {
    const cat = enrichedCategories.find((c) => c.name === catName);
    if (!cat) return 0;
    return cat.groups.flatMap((g) => g.items).filter((s) => skills.includes(s)).length;
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">프로필 설정</h1>
          <p className="text-sm text-muted-foreground">
            선호 유형과 보유 스킬을 설정하면 맞춤 해커톤을 추천받을 수 있습니다.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* 닉네임 */}
        <section className="space-y-3">
          <Label htmlFor="nickname" className="text-base font-semibold">닉네임</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={12}
            placeholder="2~12자 닉네임"
          />
          <p className="text-xs text-muted-foreground">{nickname.length}/12자</p>
        </section>

        {/* 이메일 (읽기 전용) */}
        <section className="space-y-3">
          <Label className="text-base font-semibold">이메일</Label>
          <Input value={currentUser.email} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">이메일은 변경할 수 없습니다.</p>
        </section>

        {/* 선호 유형 */}
        <section className="space-y-3">
          <Label className="text-base font-semibold">선호 해커톤 유형</Label>
          <p className="text-xs text-muted-foreground">
            관심 있는 유형을 선택하세요. 복수 선택 가능합니다.
          </p>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  preferredTypes.includes(type)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                )}
              >
                {type}
              </button>
            ))}
          </div>
          {preferredTypes.length > 0 && (
            <p className="text-xs text-primary font-medium">
              {preferredTypes.join(', ')} 유형의 해커톤을 우선 추천합니다.
            </p>
          )}
        </section>

        {/* 보유 스킬 */}
        <section className="space-y-4">
          <div>
            <Label className="text-base font-semibold">보유 스킬</Label>
            <p className="text-xs text-muted-foreground mt-1">
              검색하거나 카테고리에서 선택하세요. (최대 15개)
            </p>
          </div>

          {/* 선택된 스킬 */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
              {skills.map((skill) => (
                <Badge key={skill} className="pl-3 pr-1.5 py-1.5 text-sm gap-1 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <span className="text-xs text-muted-foreground self-center ml-1">{skills.length}/15</span>
            </div>
          )}

          {/* 스킬 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              onFocus={() => setShowPicker(true)}
              placeholder="스킬 검색 (예: React, Python, Figma...)"
              className="pl-9"
            />
          </div>

          {/* 스킬 피커 패널 */}
          {showPicker && (
            <>
              {/* 검색 결과 모드 */}
              {searchResults ? (
                <div className="border rounded-lg overflow-hidden">
                  {searchResults.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto divide-y">
                      {searchResults.map(({ category, group, skill }) => {
                        const isSelected = skills.includes(skill);
                        return (
                          <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={cn(
                              'w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center justify-between',
                              isSelected ? 'bg-primary/5' : 'hover:bg-accent'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                              <span className={cn(isSelected && 'text-primary font-medium')}>{skill}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{category} &gt; {group}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-sm text-muted-foreground text-center">
                      &quot;{skillSearch}&quot;에 해당하는 스킬이 없습니다.
                    </div>
                  )}
                </div>
              ) : (
                /* 카테고리 브라우저 모드 (2~3단 패널) */
                <div className="border rounded-lg overflow-hidden">
                  <div className="flex h-80">
                    {/* 왼쪽: 대분류 */}
                    <div className="w-36 flex-shrink-0 border-r bg-muted/30 overflow-y-auto">
                      {enrichedCategories.map((cat) => {
                        const count = getSelectedCount(cat.name);
                        return (
                          <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={cn(
                              'w-full px-3 py-3 text-left text-sm transition-colors flex items-center gap-1.5',
                              activeCategory === cat.name
                                ? 'bg-background font-medium text-primary border-r-2 border-primary'
                                : 'hover:bg-accent text-muted-foreground'
                            )}
                          >
                            <span>{cat.icon}</span>
                            <span className="flex-1 truncate">{cat.name}</span>
                            {count > 0 && (
                              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* 중간: 중분류 (그룹) */}
                    {activeCategoryData && activeCategoryData.groups.length > 1 && (
                      <div className="w-32 flex-shrink-0 border-r bg-muted/10 overflow-y-auto">
                        {activeCategoryData.groups.map((group) => {
                          const count = group.items.filter((s) => skills.includes(s)).length;
                          return (
                            <button
                              key={group.name}
                              onClick={() => setActiveGroup(group.name)}
                              className={cn(
                                'w-full px-3 py-2.5 text-left text-xs transition-colors',
                                activeGroup === group.name
                                  ? 'bg-background font-medium text-foreground border-r-2 border-primary'
                                  : 'hover:bg-accent text-muted-foreground'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate">{group.name}</span>
                                {count > 0 && (
                                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center flex-shrink-0 ml-1">
                                    {count}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* 오른쪽: 스킬 목록 */}
                    <div className="flex-1 overflow-y-auto p-3">
                      {/* 그룹이 1개면 중분류 패널 없이 바로 전체 표시 */}
                      {activeCategoryData && activeCategoryData.groups.length === 1 ? (
                        <div className="flex flex-wrap gap-2">
                          {activeCategoryData.groups[0].items.map((skill) => {
                            const isSelected = skills.includes(skill);
                            return (
                              <button
                                key={skill}
                                onClick={() => toggleSkill(skill)}
                                className={cn(
                                  'px-3 py-1.5 text-sm rounded-full transition-all duration-200 flex items-center gap-1',
                                  isSelected
                                    ? 'bg-primary text-primary-foreground font-medium'
                                    : 'bg-muted text-muted-foreground hover:bg-accent'
                                )}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                      ) : activeGroupData ? (
                        <div>
                          <p className="text-xs text-muted-foreground mb-3 font-medium">
                            {activeCategory} &gt; {activeGroup}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {activeGroupData.items.map((skill) => {
                              const isSelected = skills.includes(skill);
                              return (
                                <button
                                  key={skill}
                                  onClick={() => toggleSkill(skill)}
                                  className={cn(
                                    'px-3 py-1.5 text-sm rounded-full transition-all duration-200 flex items-center gap-1',
                                    isSelected
                                      ? 'bg-primary text-primary-foreground font-medium'
                                      : 'bg-muted text-muted-foreground hover:bg-accent'
                                  )}
                                >
                                  {isSelected && <Check className="w-3 h-3" />}
                                  {skill}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground text-center py-8">
                          왼쪽에서 카테고리를 선택하세요.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 하단 닫기 */}
                  <div className="border-t px-4 py-2 flex items-center justify-between bg-muted/20">
                    <span className="text-xs text-muted-foreground">
                      {skills.length}개 선택됨 (최대 15개)
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPicker(false)}
                      className="text-xs"
                    >
                      닫기
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* 가입 정보 */}
        <section className="space-y-2 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            가입일: {new Date(currentUser.joinedAt).toLocaleDateString('ko-KR')}
          </p>
          <p className="text-xs text-muted-foreground">
            참여 팀: {currentUser.teamCodes.length}개
          </p>
        </section>

        {/* 저장 버튼 */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} disabled={!hasChanges} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            저장하기
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}
