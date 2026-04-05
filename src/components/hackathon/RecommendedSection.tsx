'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useUserStore } from '@/store/useUserStore';
import { getRecommendations } from '@/lib/recommend';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Star, Zap } from 'lucide-react';
import { getHackathonStatusLabel, isHackathonRecruiting } from '@/lib/hackathon-utils';

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
        <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
        <p className="text-sm font-medium mb-1">맞춤 해커톤 추천을 받아보세요</p>
        <p className="text-xs text-muted-foreground mb-4">
          로그인하고 프로필을 설정하면 지금 참가 가능한 대회를 우선 추천합니다.
        </p>
      </div>
    );
  }

  const hasProfile =
    (currentUser.preferredTypes?.length || 0) > 0 ||
    (currentUser.skills?.length || 0) > 0;

  if (!hasProfile) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
        <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
        <p className="text-sm font-medium mb-1">프로필을 설정하면 추천 정확도가 올라갑니다</p>
        <p className="text-xs text-muted-foreground mb-4">
          선호 유형과 보유 스킬을 등록해두세요.
        </p>
        <Button size="sm" onClick={() => router.push('/mypage/profile')}>
          프로필 설정하기
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-primary/5 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recommendations.map(({ hackathon, score, reasons }) => (
          <button
            key={hackathon.slug}
            onClick={() => router.push(`/hackathons/${hackathon.slug}`)}
            className="text-left rounded-xl border bg-card p-4 hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  매칭 {score}점
                </span>
              </div>
              <Badge
                variant={isHackathonRecruiting(hackathon) ? 'default' : 'secondary'}
                className="text-[10px] px-1.5 py-0"
              >
                {getHackathonStatusLabel(hackathon.status)}
              </Badge>
            </div>

            <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
              {hackathon.title}
            </h3>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {reasons.map((reason, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                >
                  <Star className="w-3 h-3" />
                  {reason}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="px-2 py-0.5 rounded bg-muted">{hackathon.type}</span>
              <span>{hackathon.participantCount}명 참가</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
