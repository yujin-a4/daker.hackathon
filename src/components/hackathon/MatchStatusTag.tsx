import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  UserPlus,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  UserCheck,
  Rocket,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { analyzeHackathonMatch } from '@/lib/match-analysis';
import { calculateHackathonMatchScore } from '@/lib/recommend';
import type { Hackathon, CurrentUser } from '@/types';
import { cn } from '@/lib/utils';

interface MatchStatusTagProps {
  hackathon: Hackathon;
  currentUser: CurrentUser | null;
  isParticipating?: boolean;
  basecampUrl?: string;
  onGoToTeamBuilding?: () => void;
}

export default function MatchStatusTag({
  hackathon,
  currentUser,
  isParticipating = false,
  basecampUrl,
  onGoToTeamBuilding,
}: MatchStatusTagProps) {
  const [isOpen, setIsOpen] = useState(false);
  const analysis = analyzeHackathonMatch(hackathon, currentUser);
  // 추천 섹션과 동일한 알고리즘으로 점수 계산
  const matchRate = calculateHackathonMatchScore(hackathon, currentUser);

  if (!currentUser || !analysis) return null;

  const {
    suggestedRole,
    matchedSkills,
    missingSkills,
    roleDescription,
    neededTeamRoles,
  } = analysis;

  const fitHeadline =
    matchRate >= 70
      ? '주역 적합도가 높은 편입니다.'
      : matchRate >= 40
        ? '핵심 기여 역할로 참여할 여지가 있습니다.'
        : '주역 적합도는 낮지만 팀 기여 가능성은 남아 있습니다.';

  const contributionGuide =
    matchRate >= 70
      ? '현재 프로필만으로도 방향 설정과 실행 전개를 함께 이끌기 좋은 편입니다.'
      : matchRate >= 40
        ? '직접 일치 항목은 일부만 맞더라도, 강한 역량을 특정 파트에 집중하면 충분히 기여할 수 있습니다.'
        : '이 점수는 대회 전체와의 직접 일치도가 낮다는 뜻에 가깝습니다. 팀원으로서의 기여 가능성까지 낮다는 뜻은 아니며, 기획 보조, 운영, 문서화, QA, 발표, 리서치 역할에서 강점을 낼 수 있습니다.';

  const getThemeColor = () => {
    if (matchRate >= 70) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (matchRate >= 40) return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
    return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setIsOpen(true)}
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black shadow-sm transition-all',
            getThemeColor()
          )}
        >
          <Sparkles className="h-3.5 w-3.5 fill-current" />
          <span>{matchRate}% Match</span>
        </motion.button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[340px] overflow-hidden rounded-2xl border-slate-200 p-0 shadow-2xl dark:border-slate-800"
        sideOffset={12}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-white/20 p-1.5 backdrop-blur-md">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">AI Match Analysis</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black">{matchRate}%</span>
            </div>
          </div>

          <Progress value={matchRate} className="h-1.5 bg-white/20" />
          <p className="mt-3 min-h-[32px] text-[11px] font-medium leading-relaxed opacity-90">{fitHeadline}</p>
        </div>

        <div className="bg-white dark:bg-slate-950">
          <div className="px-5 pb-3 pt-4">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              추천 역할
            </span>
            <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-3 dark:border-indigo-500/20 dark:bg-indigo-500/10">
              <div className="mt-0.5 shrink-0 rounded-lg bg-indigo-500 p-1.5">
                <UserCheck className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">{suggestedRole}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-indigo-600/80 dark:text-indigo-400/80">
                  {roleDescription}
                </p>
              </div>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {contributionGuide}
            </p>
          </div>

          <div className="mx-5 border-t border-slate-100 dark:border-slate-800" />

          <div className="space-y-2 px-5 py-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Match Signals
              </span>
              <span className="text-[10px] font-bold text-indigo-500">{matchedSkills.length} Found</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.slice(0, 4).map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-1 rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  {skill}
                </div>
              ))}
              {missingSkills.length > 0 && (
                <div className="flex items-center gap-1 rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
                  <AlertCircle className="h-2.5 w-2.5" />
                  +{missingSkills.length} more
                </div>
              )}
            </div>
          </div>

          <div className="mx-5 border-t border-slate-100 dark:border-slate-800" />

          <div className="px-5 py-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-2 flex items-center gap-2">
                <UserPlus className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
                  팀 기여 포인트
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {neededTeamRoles.map((role) => (
                  <Badge
                    key={role}
                    variant="outline"
                    className="border-slate-200 bg-white text-[10px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  >
                    {role}
                  </Badge>
                ))}
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
                부족한 역할을 채우는 보완형 팀원으로 접근해도 충분히 경쟁력이 있습니다.
              </p>
            </div>
          </div>

          <div className="px-5 pb-4">
            {isParticipating && basecampUrl ? (
              <Link
                href={basecampUrl}
                className="group flex w-full items-center justify-between rounded-xl bg-indigo-600 p-3 text-white transition-colors hover:bg-indigo-700"
              >
                <span className="text-xs font-bold">내 베이스캠프로 가기</span>
                <Rocket className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onGoToTeamBuilding?.();
                }}
                className="group flex w-full items-center justify-between rounded-xl bg-indigo-50 p-3 text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
              >
                <span className="text-xs font-bold">팀 빌딩 시작하기</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
