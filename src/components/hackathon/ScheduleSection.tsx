'use client';

import type { HackathonDetail } from '@/types';
import { isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatDateTimeWithDay, getDday } from '@/lib/date';
import { CheckCircle2, Clock, Flag } from 'lucide-react';

type ScheduleSectionProps = {
  schedule: HackathonDetail['sections']['schedule'];
};

export default function ScheduleSection({ schedule }: ScheduleSectionProps) {
  const milestones = schedule.milestones;
  const lastPastIndex = milestones.map(m => new Date(m.at)).findLastIndex(d => isPast(d));

  return (
    <div className="py-2 space-y-0">
      {milestones.map((milestone, index) => {
        const isPastMilestone = index <= lastPastIndex;
        const isCurrentPhase = index === lastPastIndex;
        const isNextMilestone = index === lastPastIndex + 1;
        const isLast = index === milestones.length - 1;

        return (
          <div key={index} className="flex gap-4 relative">
            {/* Timeline column */}
            <div className="flex flex-col items-center flex-shrink-0 w-10">
              {/* Connector top */}
              {index > 0 && (
                <div className={cn(
                  "w-0.5 h-4 flex-shrink-0",
                  isPastMilestone ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-700"
                )} />
              )}

              {/* Node */}
              <div className="relative">
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all duration-300",
                  isPastMilestone
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400",
                  isCurrentPhase && "ring-4 ring-indigo-500/20"
                )}>
                  {isPastMilestone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isLast ? (
                    <Flag className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>

                {isCurrentPhase && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                  </span>
                )}
              </div>

              {/* Connector bottom */}
              {!isLast && (
                <div className={cn(
                  "w-0.5 flex-1 min-h-[20px]",
                  isPastMilestone ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-700"
                )} />
              )}
            </div>

            {/* Content */}
            <div className={cn(
              "pb-5 pt-1 flex-1 min-w-0",
              index === 0 && "pt-0",
              isLast && "pb-2"
            )}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <h4 className={cn(
                  "font-bold text-sm leading-tight",
                  isPastMilestone ? "text-slate-900 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"
                )}>
                  {milestone.name}
                  {isCurrentPhase && (
                    <span className="ml-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-md align-middle">
                      현재
                    </span>
                  )}
                </h4>
                {isNextMilestone && (
                  <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-md border border-rose-100 dark:border-rose-900/30 whitespace-nowrap">
                    {getDday(milestone.at)} 남음
                  </span>
                )}
              </div>
              <div className={cn(
                "flex items-center gap-1 mt-1 text-[11px]",
                isPastMilestone ? "text-slate-400" : "text-slate-400/60"
              )}>
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>{formatDateTimeWithDay(milestone.at)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
