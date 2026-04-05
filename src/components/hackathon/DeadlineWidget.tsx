'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Milestone {
  name: string;
  at: string;
}

interface DeadlineWidgetProps {
  deadlineAt: string;
  milestones: Milestone[];
  timezone: string;
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function formatMilestoneDate(isoString: string) {
  const d = new Date(isoString);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return { date: `${month}/${day}`, time: `${hours}:${minutes}` };
}

function isPastDate(isoString: string) {
  return new Date(isoString).getTime() < Date.now();
}

export default function DeadlineWidget({ deadlineAt, milestones, timezone }: DeadlineWidgetProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(timer);
  }, []);

  // Current time display
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dayName = DAY_NAMES[now.getDay()];

  // Countdown
  const deadline = new Date(deadlineAt);
  const diffMs = deadline.getTime() - now.getTime();
  const isExpired = diffMs <= 0;

  let countdownDays = 0, countdownHours = 0, countdownMinutes = 0, countdownSeconds = 0;
  if (!isExpired) {
    countdownDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    countdownHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    countdownMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    countdownSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  }

  // Deadline formatted
  const deadlineDate = new Date(deadlineAt);
  const deadlineMonth = deadlineDate.getMonth() + 1;
  const deadlineDay = deadlineDate.getDate();
  const deadlineHours = String(deadlineDate.getHours()).padStart(2, '0');
  const deadlineMinutes = String(deadlineDate.getMinutes()).padStart(2, '0');

  // Find next upcoming milestone
  const nextMilestoneIdx = milestones.findIndex(m => !isPastDate(m.at));

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Current Time */}
      <div className="p-5 text-center border-b">
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-2">
          <Clock className="w-3.5 h-3.5" />
          현재 시간
        </div>
        <div className="text-xl font-mono font-semibold tracking-widest tabular-nums text-slate-700 dark:text-slate-300">
          {hours}
          <span className="animate-pulse">:</span>
          {minutes}
          <span className="animate-pulse">:</span>
          {seconds}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {year}.{month}.{day} ({dayName})
        </div>
      </div>

      {/* Countdown */}
      <div className="p-5 text-center border-b">
        <div className="text-xs text-muted-foreground mb-3 font-medium">
          {isExpired ? '마감 완료' : '마감까지'}
        </div>
        {isExpired ? (
          <div className="text-lg font-bold text-muted-foreground">마감되었습니다</div>
        ) : (
          <div className="flex justify-center gap-1.5">
            {[
              { value: countdownDays, label: '일' },
              { value: countdownHours, label: '시' },
              { value: countdownMinutes, label: '분' },
              { value: countdownSeconds, label: '초' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold font-mono tabular-nums",
                  label === '분' || label === '초'
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                    : 'bg-muted text-foreground'
                )}>
                  {String(value).padStart(2, '0')}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">{label}</span>
              </div>
            ))}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-3">
          {deadlineMonth}월 {deadlineDay}일 {deadlineHours}:{deadlineMinutes} 마감
        </div>
      </div>


    </div>
  );
}
