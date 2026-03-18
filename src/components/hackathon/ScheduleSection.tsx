'use client';

import type { HackathonDetail } from '@/types';
import { isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatDateTimeWithDay, getDday } from '@/lib/date';
import { Badge } from '@/components/ui/badge';

type ScheduleSectionProps = {
  schedule: HackathonDetail['sections']['schedule'];
};

export default function ScheduleSection({ schedule }: ScheduleSectionProps) {
  const now = new Date();
  const milestones = schedule.milestones;

  const lastPastIndex = milestones.map(m => new Date(m.at)).findLastIndex(d => isPast(d));

  return (
    <div className="relative pl-4">
      <div className="absolute left-6 top-2.5 bottom-2.5 w-0.5 bg-slate-200" aria-hidden="true" />
      
      <div className="space-y-10">
        {milestones.map((milestone, index) => {
          const isPastMilestone = index <= lastPastIndex;
          const isCurrentPhase = index === lastPastIndex;
          const isNextMilestone = index === lastPastIndex + 1;

          return (
            <div key={index} className="relative pl-8">
              <div className="absolute left-[-0.125rem] top-2 transform -translate-x-1/2">
                <div className={cn(
                  "w-5 h-5 rounded-full",
                  isPastMilestone ? "bg-indigo-500" : "bg-white border-2 border-slate-300",
                  isCurrentPhase && "ring-8 ring-indigo-500/20"
                )}></div>
                 {isPastMilestone && index < lastPastIndex + 1 && (
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 h-12 w-0.5 bg-indigo-500"></div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-1">
                <h4 className={cn(
                  "font-bold text-lg",
                  isPastMilestone ? "text-slate-800" : "text-slate-400"
                )}>{milestone.name}</h4>
                {isCurrentPhase && <Badge className="bg-indigo-100 text-indigo-700 text-xs rounded-full px-2 animate-pulse">현재 단계</Badge>}
              </div>

              <p className={cn("text-sm", isPastMilestone ? "text-slate-500" : "text-slate-400")}>
                {formatDateTimeWithDay(milestone.at)}
              </p>
              
              {isNextMilestone && (
                 <p className="text-sm font-semibold text-red-500 mt-1.5">
                   마감까지 {getDday(milestone.at)}
                 </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
