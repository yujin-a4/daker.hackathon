import {
  format,
  differenceInDays,
  isPast,
  intervalToDuration,
} from 'date-fns';

export function formatDate(isoString: string): string {
  return format(new Date(isoString), 'yyyy.MM.dd');
}

export function formatDateTime(isoString: string): string {
  return format(new Date(isoString), 'yyyy.MM.dd HH:mm');
}

export function getDday(targetDate: string): string {
  const target = new Date(targetDate);
  const now = new Date();

  if (isPast(target)) {
    return '마감됨';
  }

  const diff = differenceInDays(target, now);
  if (diff === 0) return 'D-Day';
  return `D-${diff}`;
}

export function getCountdown(targetDate: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const target = new Date(targetDate);
  const now = new Date();

  if (isPast(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const duration = intervalToDuration({ start: now, end: target });
  return {
    days: duration.days || 0,
    hours: duration.hours || 0,
    minutes: duration.minutes || 0,
    seconds: duration.seconds || 0,
  };
}

export function isExpired(isoString: string): boolean {
  return isPast(new Date(isoString));
}
