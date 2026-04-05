import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
        <div className="bg-[#615AFA] p-6 text-white">
          <div className="text-[12px] font-bold uppercase tracking-wider mb-2 opacity-90">
            AI MATCH
          </div>
          <div className="text-4xl font-extrabold mb-4">
            {matchRate}%
          </div>
          <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full" 
              style={{ width: `${matchRate}%` }} 
            />
          </div>
        </div>

        <div className="bg-[#F9F9F6] dark:bg-slate-950 flex flex-col">
          <div className="px-6 py-5">
            <span className="mb-3 block text-[13px] font-bold text-gray-500 dark:text-slate-400">
              추천 역할
            </span>
            <div className="flex items-center gap-3">
              <Badge className="bg-[#E7E4F9] text-[#615AFA] hover:bg-[#E7E4F9] dark:bg-indigo-900/50 dark:text-indigo-300 font-bold px-3 py-1.5 text-[13px] shadow-none rounded-lg border-none">
                {suggestedRole}
              </Badge>
              <span className="text-[14px] font-medium text-gray-700 dark:text-slate-300">
                {roleDescription}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-gray-200/60 dark:bg-slate-800" />

          <div className="px-6 py-5">
            <span className="mb-3 block text-[13px] font-bold text-gray-500 dark:text-slate-400">
              보유 스킬
            </span>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.length > 0 ? (
                matchedSkills.slice(0, 5).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="bg-[#E7E4F9]/50 text-[#615AFA] border border-gray-200 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm font-medium px-3 py-1.5 text-[13px] rounded-lg"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-[13px] text-gray-500">등록된 스킬이 없습니다.</span>
              )}
            </div>
          </div>

          <div className="w-full h-px bg-gray-200/60 dark:bg-slate-800" />

          <div className="px-6 py-5">
            <span className="mb-3 block text-[13px] font-bold text-gray-500 dark:text-slate-400">
              함께하면 좋은 팀원
            </span>
            <div className="flex flex-col gap-1.5">
              <p className="text-[15px] font-bold text-gray-900 dark:text-slate-200">
                {neededTeamRoles.length > 0 ? neededTeamRoles[0] : 'AI/ML 개발자'}
              </p>
              <p className="text-[13px] font-medium text-gray-500 dark:text-slate-400">
                부족한 역할을 채워줄 보완형 파트너
              </p>
            </div>
          </div>

          <div className="px-6 pb-6 pt-2">
            {isParticipating && basecampUrl ? (
              <Link
                href={basecampUrl}
                className="flex w-full items-center justify-center rounded-xl bg-[#615AFA] py-3.5 text-white transition-colors hover:bg-[#504ada] shadow-sm"
              >
                <span className="text-[14px] font-bold">내 베이스캠프로 가기</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onGoToTeamBuilding?.();
                }}
                className="flex w-full items-center justify-center rounded-xl bg-[#615AFA] py-3.5 text-white transition-colors hover:bg-[#504ada] shadow-sm"
              >
                <span className="text-[14px] font-bold">팀 빌딩 시작하기</span>
              </button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
