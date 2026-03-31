'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sparkles, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfile {
  tags: string[];
}

interface HackathonInfo {
  required_tags: string[];
}

interface MatchBadgeProps {
  userProfile: UserProfile;
  hackathonInfo: HackathonInfo;
  className?: string;
}

const MatchBadge: React.FC<MatchBadgeProps> = ({ userProfile, hackathonInfo, className }) => {
  const matchingData = useMemo(() => {
    const userTags = new Set(userProfile.tags.map(t => t.toLowerCase()));
    const requiredTags = hackathonInfo.required_tags;
    
    const matched = requiredTags.filter(tag => userTags.has(tag.toLowerCase()));
    const score = Math.round((matched.length / Math.max(requiredTags.length, 1)) * 100);
    
    // 추천 포지션 로직 (단순화)
    let recommendedPosition = "AI 서비스 기획자";
    if (userProfile.tags.some(t => t.includes('개발') || t.includes('LLM'))) {
      recommendedPosition = "AI 엔지니어";
    } else if (userProfile.tags.some(t => t.includes('디자인') || t.includes('UI'))) {
      recommendedPosition = "AI Product Designer";
    }

    return { score, matched, recommendedPosition };
  }, [userProfile, hackathonInfo]);

  return (
    <Card className={cn("relative overflow-hidden border bg-card/50 backdrop-blur-xl p-6 shadow-2xl transition-all hover:shadow-cyan-500/10", className)}>
      {/* Background Gradient Orbs */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl opacity-50" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl opacity-50" />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
              <Sparkles size={18} />
            </div>
            <h3 className="text-lg font-bold text-foreground">AI Matcher</h3>
          </div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 border border-border"
          >
            <span className="text-xs font-medium text-muted-foreground">Match Rate</span>
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{matchingData.score}%</span>
          </motion.div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">유진 님</span>의 AI 역량과 해커톤의 적합도를 분석했어요!
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {matchingData.matched.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20 hover:bg-cyan-500/20 transition-colors">
              {tag}
            </Badge>
          ))}
          {matchingData.matched.length === 0 && (
            <p className="text-xs text-muted-foreground italic">일치하는 기술 스택을 찾고 있습니다...</p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-4 border border-border">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Recommended Role</span>
            <span className="text-sm font-bold text-foreground">{matchingData.recommendedPosition}</span>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary animate-pulse">
            <Zap size={20} className="fill-current" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MatchBadge;
