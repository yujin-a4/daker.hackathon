'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Layers3, Sparkles, Wrench } from 'lucide-react';
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

function SectionLabel({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
      {icon}
      <span>{title}</span>
    </div>
  );
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
  const matchRate = calculateHackathonMatchScore(hackathon, currentUser);

  if (!currentUser || !analysis) return null;

  const { suggestedRole, matchedRoles, matchedDomains, matchedSkills, missingSkills, neededTeamRoles } = analysis;

  const scoreTone =
    matchRate >= 70
      ? '지금 바로 참여를 검토해도 좋은 편입니다.'
      : matchRate >= 40
        ? '역할이나 팀 구성을 맞추면 충분히 참여할 만합니다.'
        : '관심 주제는 볼 만하지만 역할 적합도는 낮은 편입니다.';

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
        className="w-[360px] overflow-hidden rounded-2xl border border-slate-200 p-0 shadow-2xl dark:border-slate-800"
        sideOffset={12}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="border-b bg-slate-950 px-5 py-4 text-white dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Match Score</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-3xl font-black">{matchRate}%</span>
                <span className="pb-1 text-xs text-slate-400">{scoreTone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 bg-white px-5 py-5 dark:bg-slate-950">
          <section>
            <SectionLabel icon={<Briefcase className="h-3.5 w-3.5" />} title="추천 역할" />
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{suggestedRole}</p>
            {(matchedRoles.length > 0 || matchedDomains.length > 0) && (
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                {matchedRoles.length > 0 ? `${matchedRoles.join(', ')} 역할 기준으로 적합도가 잡혔고, ` : ''}
                {matchedDomains.length > 0 ? `${matchedDomains.join(', ')} 분야와도 연결됩니다.` : '현재 프로필 기준으로 가장 자연스러운 포지션입니다.'}
              </p>
            )}
          </section>

          <section>
            <SectionLabel icon={<Layers3 className="h-3.5 w-3.5" />} title="맞는 포인트" />
            <div className="flex flex-wrap gap-2">
              {matchedDomains.map((domain) => (
                <Badge key={`domain-${domain}`} variant="secondary" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                  {domain}
                </Badge>
              ))}
              {matchedRoles.map((role) => (
                <Badge key={`role-${role}`} variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {role}
                </Badge>
              ))}
              {matchedSkills.slice(0, 4).map((skill) => (
                <Badge key={`skill-${skill}`} variant="outline">
                  {skill}
                </Badge>
              ))}
              {matchedDomains.length === 0 && matchedRoles.length === 0 && matchedSkills.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400">직접 맞는 항목은 아직 적습니다.</p>
              )}
            </div>
          </section>

          <section>
            <SectionLabel icon={<Wrench className="h-3.5 w-3.5" />} title="부족한 포인트" />
            <div className="space-y-2">
              <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">
                {missingSkills.length > 0
                  ? `현재 프로필에 없는 관련 기술은 ${missingSkills.slice(0, 3).join(', ')} 쪽입니다.`
                  : '기술 스택 기준으로 크게 비는 항목은 없습니다.'}
              </p>
              <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">
                {neededTeamRoles.length > 0
                  ? `팀을 꾸린다면 ${neededTeamRoles.slice(0, 2).join(', ')} 역할을 같이 찾는 편이 좋습니다.`
                  : '현재 프로필만으로도 핵심 역할 축은 어느 정도 갖춰져 있습니다.'}
              </p>
            </div>
          </section>

          <div className="pt-1">
            {isParticipating && basecampUrl ? (
              <Link
                href={basecampUrl}
                className="flex w-full items-center justify-center rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                베이스캠프로 이동
              </Link>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onGoToTeamBuilding?.();
                }}
                className="flex w-full items-center justify-center gap-1 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                팀 빌딩 보러가기
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
