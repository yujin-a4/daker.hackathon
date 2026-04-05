'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useUserStore } from '@/store/useUserStore';
import { getRecommendations } from '@/lib/recommend';
import { getHackathonStatusLabel, isHackathonRecruiting } from '@/lib/hackathon-utils';
import { hasMatchingProfile } from '@/lib/user-profile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Star, Zap } from 'lucide-react';

export default function RecommendedSection() {
  const { hackathons } = useHackathonStore();
  const currentUser = useUserStore((s) => s.currentUser);
  const router = useRouter();

  const recommendations = useMemo(
    () => getRecommendations(hackathons, currentUser, 4),
    [hackathons, currentUser]
  );

  if (!currentUser) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
        <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
        <p className="mb-1 text-sm font-medium">로그인하고 맞춤 해커톤 추천을 받아보세요.</p>
        <p className="text-xs text-muted-foreground">
          로그인 후 프로필을 설정하면 지금 참가 가능한 해커톤을 우선 추천합니다.
        </p>
      </div>
    );
  }

  if (!hasMatchingProfile(currentUser)) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
        <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
        <p className="mb-1 text-sm font-medium">프로필을 설정하면 추천 해커톤을 볼 수 있습니다.</p>
        <p className="mb-4 text-xs text-muted-foreground">
          선호 유형이나 보유 스킬을 등록하면 더 정확한 추천이 활성화됩니다.
        </p>
        <Button size="sm" onClick={() => router.push('/mypage/profile')}>
          프로필 설정하기
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-primary/5 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold">{currentUser.nickname}님을 위한 추천</h2>
            <p className="text-[11px] text-muted-foreground">선호 유형과 보유 스킬 기반</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/mypage/profile')}
          className="text-xs text-muted-foreground hover:text-primary"
        >
          프로필 수정
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {recommendations.map(({ hackathon, score, reasons }) => (
          <button
            key={hackathon.slug}
            onClick={() => router.push(`/hackathons/${hackathon.slug}`)}
            className="group rounded-xl border bg-card p-4 text-left transition-all duration-200 hover:border-primary/50 hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">매칭 {score}점</span>
              </div>
              <Badge
                variant={isHackathonRecruiting(hackathon) ? 'default' : 'secondary'}
                className="px-1.5 py-0 text-[10px]"
              >
                {getHackathonStatusLabel(hackathon.status)}
              </Badge>
            </div>

            <h3 className="mb-2 line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary">
              {hackathon.title}
            </h3>

            <div className="mb-2 flex flex-wrap gap-1.5">
              {reasons.map((reason, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                >
                  <Star className="h-3 w-3" />
                  {reason}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="rounded bg-muted px-2 py-0.5">{hackathon.type}</span>
              <span>{hackathon.participantCount}명 참가</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
