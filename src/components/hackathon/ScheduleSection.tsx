'use client';

import type { HackathonDetail } from '@/types';
import { isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatDateTimeWithDay, getDday } from '@/lib/date';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, Flag } from 'lucide-react';

type ScheduleSectionProps = {
  schedule: HackathonDetail['sections']['schedule'];
};

export default function ScheduleSection({ schedule }: ScheduleSectionProps) {
  const milestones = schedule.milestones;
  const lastPastIndex = milestones.map(m => new Date(m.at)).findLastIndex(d => isPast(d));

  return (
    <div className="w-full py-4 overflow-x-auto no-scrollbar">
      <div className="flex min-w-max px-4 gap-0">
        {milestones.map((milestone, index) => {
          const isPastMilestone = index <= lastPastIndex;
          const isCurrentPhase = index === lastPastIndex;
          const isNextMilestone = index === lastPastIndex + 1;
          const isLast = index === milestones.length - 1;

          return (
            <div key={index} className="flex flex-col items-center w-48 relative group">
              {/* Connector Line */}
              {!isLast && (
                <div className={cn(
                  "absolute top-[22px] left-[50%] right-[-50%] h-[3px] z-0",
                  isPastMilestone ? "bg-indigo-500" : "bg-slate-100 dark:bg-slate-800"
                )} />
              )}

              {/* Node Indicator */}
              <div className="relative z-10 mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                  isPastMilestone 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none" 
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400",
                  isCurrentPhase && "ring-4 ring-indigo-500/20 scale-110"
                )}>
                  {isPastMilestone ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : isLast ? (
                    <Flag className="w-5 h-5" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                
                {isCurrentPhase && (
                  <div className="absolute -top-1 -right-1">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="text-center px-2">
                <h4 className={cn(
                  "font-bold text-sm mb-1 leading-tight",
                  isPastMilestone ? "text-slate-900 dark:text-slate-100" : "text-slate-400 dark:text-slate-600"
                )}>
                  {milestone.name}
                </h4>
                
                <div className={cn(
                  "flex flex-col items-center gap-0.5 text-[11px]",
                  isPastMilestone ? "text-slate-500" : "text-slate-400/70"
                )}>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDateTimeWithDay(milestone.at).split(' ')[0]}</span>
                  </div>
                  <span className="opacity-70">{formatDateTimeWithDay(milestone.at).split(' ')[1]}</span>
                </div>

                {isNextMilestone && (
                  <div className="mt-3 px-2 py-1 bg-rose-50 dark:bg-rose-950/20 rounded-md border border-rose-100 dark:border-rose-900/30 inline-block">
                    <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 leading-none">
                      {getDday(milestone.at)} 남음
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
