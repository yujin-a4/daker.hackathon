'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Save, Search, X } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  COLLABORATION_CATEGORIES,
  INTEREST_DOMAIN_OPTIONS,
  PRIMARY_ROLE_OPTIONS,
  TECH_STACK_CATEGORIES,
} from '@/lib/match-taxonomy';

function ToggleChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-1.5 text-sm transition-colors',
        selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
      )}
    >
      {label}
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const currentUser = useUserStore((s) => s.currentUser);
  const updateProfile = useUserStore((s) => s.updateProfile);

  const [nickname, setNickname] = useState('');
  const [primaryRoles, setPrimaryRoles] = useState<string[]>([]);
  const [interestDomains, setInterestDomains] = useState<string[]>([]);
  const [techStacks, setTechStacks] = useState<string[]>([]);
  const [collaborationStrengths, setCollaborationStrengths] = useState<string[]>([]);

  const [techSearch, setTechSearch] = useState('');
  const [showTechPicker, setShowTechPicker] = useState(false);
  const [activeTechCategory, setActiveTechCategory] = useState(TECH_STACK_CATEGORIES[0]?.name || '');

  const [collabSearch, setCollabSearch] = useState('');
  const [showCollabPicker, setShowCollabPicker] = useState(false);
  const [activeCollabCategory, setActiveCollabCategory] = useState(COLLABORATION_CATEGORIES[0]?.name || '');

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
      return;
    }
    setNickname(currentUser.nickname);
    setPrimaryRoles(currentUser.primaryRoles || []);
    setInterestDomains(currentUser.interestDomains || []);
    setTechStacks(currentUser.techStacks || []);
    setCollaborationStrengths(currentUser.collaborationStrengths || []);
  }, [currentUser, router]);

  const hasChanges = useMemo(() => {
    if (!currentUser) return false;
    return (
      nickname !== currentUser.nickname ||
      JSON.stringify(primaryRoles) !== JSON.stringify(currentUser.primaryRoles || []) ||
      JSON.stringify(interestDomains) !== JSON.stringify(currentUser.interestDomains || []) ||
      JSON.stringify(techStacks) !== JSON.stringify(currentUser.techStacks || []) ||
      JSON.stringify(collaborationStrengths) !== JSON.stringify(currentUser.collaborationStrengths || [])
    );
  }, [collaborationStrengths, currentUser, interestDomains, nickname, primaryRoles, techStacks]);

  const techSearchResults = useMemo(() => {
    if (!techSearch.trim()) return null;
    const query = techSearch.toLowerCase();
    return TECH_STACK_CATEGORIES.flatMap((category) =>
      category.items
        .filter((item) => item.toLowerCase().includes(query))
        .map((item) => ({ category: category.name, item }))
    );
  }, [techSearch]);

  const collabSearchResults = useMemo(() => {
    if (!collabSearch.trim()) return null;
    const query = collabSearch.toLowerCase();
    return COLLABORATION_CATEGORIES.flatMap((category) =>
      category.items
        .filter((item) => item.toLowerCase().includes(query))
        .map((item) => ({ category: category.name, item }))
    );
  }, [collabSearch]);

  const activeTechCategoryData = TECH_STACK_CATEGORIES.find((category) => category.name === activeTechCategory);
  const activeCollabCategoryData = COLLABORATION_CATEGORIES.find((category) => category.name === activeCollabCategory);

  if (!currentUser) return null;

  const toggleValue = (value: string, state: string[], setter: (values: string[]) => void) => {
    setter(state.includes(value) ? state.filter((item) => item !== value) : [...state, value]);
  };

  const removeTechStack = (value: string) => {
    setTechStacks((prev) => prev.filter((item) => item !== value));
  };

  const removeCollaboration = (value: string) => {
    setCollaborationStrengths((prev) => prev.filter((item) => item !== value));
  };

  const handleSave = () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname || trimmedNickname.length < 2 || trimmedNickname.length > 12) {
      toast({ title: '닉네임은 2~12자로 입력해주세요.', variant: 'destructive' });
      return;
    }

    updateProfile({
      nickname: trimmedNickname,
      primaryRoles,
      interestDomains,
      techStacks,
      collaborationStrengths,
    });

    toast({
      title: '프로필을 저장했습니다.',
      description: '새 프로필 구조를 기준으로 해커톤과 팀 추천이 계산됩니다.',
    });
    router.push('/mypage');
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">프로필 설정</h1>
          <p className="text-sm text-muted-foreground">
            주 역할, 관심 분야, 기술 스택, 협업 강점을 각각 독립적으로 선택합니다.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <Label htmlFor="nickname" className="text-base font-semibold">닉네임</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            maxLength={12}
            placeholder="2~12자 닉네임"
          />
          <p className="text-xs text-muted-foreground">{nickname.length}/12</p>
        </section>

        <section className="space-y-3">
          <Label className="text-base font-semibold">이메일</Label>
          <Input value={currentUser.email} disabled className="bg-muted" />
        </section>

        <section className="space-y-3">
          <Label className="text-base font-semibold">주 역할</Label>
          <p className="text-xs text-muted-foreground">팀 안에서 실제로 맡을 수 있는 역할을 모두 선택하세요.</p>
          <div className="flex flex-wrap gap-2">
            {PRIMARY_ROLE_OPTIONS.map((role) => (
              <ToggleChip
                key={role}
                label={role}
                selected={primaryRoles.includes(role)}
                onClick={() => toggleValue(role, primaryRoles, setPrimaryRoles)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <Label className="text-base font-semibold">관심 분야</Label>
          <p className="text-xs text-muted-foreground">어떤 주제의 해커톤과 프로젝트를 선호하는지 선택하세요.</p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_DOMAIN_OPTIONS.map((domain) => (
              <ToggleChip
                key={domain}
                label={domain}
                selected={interestDomains.includes(domain)}
                onClick={() => toggleValue(domain, interestDomains, setInterestDomains)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <Label className="text-base font-semibold">기술 스택</Label>
            <p className="text-xs text-muted-foreground">검색하거나 분류별로 탐색해서 기술과 도구를 선택하세요.</p>
          </div>

          {techStacks.length > 0 && (
            <div className="flex flex-wrap gap-2 rounded-xl bg-muted/40 p-3">
              {techStacks.map((stack) => (
                <Badge key={stack} className="gap-1 bg-primary/10 px-3 py-1 text-primary hover:bg-primary/20">
                  {stack}
                  <button type="button" onClick={() => removeTechStack(stack)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <span className="self-center text-xs text-muted-foreground">{techStacks.length}개 선택됨</span>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={techSearch}
              onChange={(event) => setTechSearch(event.target.value)}
              onFocus={() => setShowTechPicker(true)}
              placeholder="기술 스택 검색 (예: React, Python, Figma...)"
              className="pl-9"
            />
          </div>

          {showTechPicker && (
            <>
              {techSearchResults ? (
                <div className="overflow-hidden rounded-xl border">
                  {techSearchResults.length > 0 ? (
                    <div className="max-h-72 divide-y overflow-y-auto">
                      {techSearchResults.map(({ category, item }) => {
                        const selected = techStacks.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => toggleValue(item, techStacks, setTechStacks)}
                            className={cn(
                              'flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors',
                              selected ? 'bg-primary/5' : 'hover:bg-accent'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {selected && <Check className="h-4 w-4 text-primary" />}
                              <span className={cn(selected && 'font-medium text-primary')}>{item}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{category}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      "{techSearch}" 검색 결과가 없습니다.
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border">
                  <div className="flex h-80">
                    <div className="w-40 shrink-0 border-r bg-muted/30">
                      {TECH_STACK_CATEGORIES.map((category) => (
                        <button
                          type="button"
                          key={category.name}
                          onClick={() => setActiveTechCategory(category.name)}
                          className={cn(
                            'w-full px-4 py-3 text-left text-sm transition-colors',
                            activeTechCategory === category.name
                              ? 'border-r-2 border-primary bg-background font-medium text-primary'
                              : 'text-muted-foreground hover:bg-accent'
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span>{category.name}</span>
                            <span className="text-xs">
                              {category.items.filter((item) => techStacks.includes(item)).length || ''}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                      <p className="mb-3 text-xs font-medium text-muted-foreground">{activeTechCategory}</p>
                      <div className="flex flex-wrap gap-2">
                        {activeTechCategoryData?.items.map((item) => (
                          <ToggleChip
                            key={item}
                            label={item}
                            selected={techStacks.includes(item)}
                            onClick={() => toggleValue(item, techStacks, setTechStacks)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2">
                    <span className="text-xs text-muted-foreground">{techStacks.length}개 선택됨</span>
                    <Button variant="ghost" size="sm" onClick={() => setShowTechPicker(false)} className="text-xs">
                      닫기
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <Label className="text-base font-semibold">협업 강점</Label>
            <p className="text-xs text-muted-foreground">검색하거나 분류별로 탐색해서 협업 역량을 선택하세요.</p>
          </div>

          {collaborationStrengths.length > 0 && (
            <div className="flex flex-wrap gap-2 rounded-xl bg-muted/40 p-3">
              {collaborationStrengths.map((item) => (
                <Badge key={item} variant="outline" className="gap-1 px-3 py-1">
                  {item}
                  <button type="button" onClick={() => removeCollaboration(item)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <span className="self-center text-xs text-muted-foreground">{collaborationStrengths.length}개 선택됨</span>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={collabSearch}
              onChange={(event) => setCollabSearch(event.target.value)}
              onFocus={() => setShowCollabPicker(true)}
              placeholder="협업 강점 검색 (예: PRD 작성, 발표/피칭...)"
              className="pl-9"
            />
          </div>

          {showCollabPicker && (
            <>
              {collabSearchResults ? (
                <div className="overflow-hidden rounded-xl border">
                  {collabSearchResults.length > 0 ? (
                    <div className="max-h-72 divide-y overflow-y-auto">
                      {collabSearchResults.map(({ category, item }) => {
                        const selected = collaborationStrengths.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => toggleValue(item, collaborationStrengths, setCollaborationStrengths)}
                            className={cn(
                              'flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors',
                              selected ? 'bg-primary/5' : 'hover:bg-accent'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {selected && <Check className="h-4 w-4 text-primary" />}
                              <span className={cn(selected && 'font-medium text-primary')}>{item}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{category}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      "{collabSearch}" 검색 결과가 없습니다.
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border">
                  <div className="flex h-72">
                    <div className="w-40 shrink-0 border-r bg-muted/30">
                      {COLLABORATION_CATEGORIES.map((category) => (
                        <button
                          type="button"
                          key={category.name}
                          onClick={() => setActiveCollabCategory(category.name)}
                          className={cn(
                            'w-full px-4 py-3 text-left text-sm transition-colors',
                            activeCollabCategory === category.name
                              ? 'border-r-2 border-primary bg-background font-medium text-primary'
                              : 'text-muted-foreground hover:bg-accent'
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span>{category.name}</span>
                            <span className="text-xs">
                              {category.items.filter((item) => collaborationStrengths.includes(item)).length || ''}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                      <p className="mb-3 text-xs font-medium text-muted-foreground">{activeCollabCategory}</p>
                      <div className="flex flex-wrap gap-2">
                        {activeCollabCategoryData?.items.map((item) => (
                          <ToggleChip
                            key={item}
                            label={item}
                            selected={collaborationStrengths.includes(item)}
                            onClick={() => toggleValue(item, collaborationStrengths, setCollaborationStrengths)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2">
                    <span className="text-xs text-muted-foreground">{collaborationStrengths.length}개 선택됨</span>
                    <Button variant="ghost" size="sm" onClick={() => setShowCollabPicker(false)} className="text-xs">
                      닫기
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} disabled={!hasChanges} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
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
