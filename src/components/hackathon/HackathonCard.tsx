'use client'

import { useRouter } from 'next/navigation';
import { Calendar, Users } from 'lucide-react';
import { differenceInDays } from 'date-fns';

import type { Hackathon } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { getDday, formatDate, isExpired } from '@/lib/date';
import { getStatusColor, getGradientBySlug } from '@/lib/utils';

interface HackathonCardProps {
  hackathon: Hackathon;
}

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  const router = useRouter();
  const [color1, color2] = getGradientBySlug(hackathon.slug);

  let statusText = '';
  switch (hackathon.status) {
    case 'ongoing':
      statusText = '진행중';
      break;
    case 'upcoming':
      statusText = '예정';
      break;
    case 'ended':
      statusText = '종료';
      break;
  }

  const dday = getDday(hackathon.period.submissionDeadlineAt);
  const isDdayUrgent = !isExpired(hackathon.period.submissionDeadlineAt) && differenceInDays(new Date(hackathon.period.submissionDeadlineAt), new Date()) <= 7;

  return (
    <Card
      className="flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-[1.01] hover:border-slate-200 cursor-pointer border border-slate-100 bg-white"
      onClick={() => router.push(`/hackathons/${hackathon.slug}`)}
    >
      <div
        className="relative flex items-center justify-center h-40 w-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
      >
        <h3 className="text-white/15 text-5xl font-extrabold text-center break-all px-4 select-none">
          {hackathon.title}
        </h3>
        
        <div className="absolute top-3 left-3">
          <Badge className={`font-semibold text-xs ${getStatusColor(hackathon.status)}`}>
            {statusText}
          </Badge>
        </div>

        {hackathon.status !== 'ended' && (
          <div className="absolute top-3 right-3">
            <Badge className={`font-semibold text-xs ${isDdayUrgent ? 'bg-red-100 text-red-600' : 'bg-white/90 text-slate-700'}`}>
              {dday}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h4 className="text-lg font-semibold line-clamp-2 h-[56px] leading-snug">{hackathon.title}</h4>
        
        <div className="mt-3 flex flex-wrap gap-1.5">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 text-xs px-2 py-1 font-normal">{tag}</Badge>
          ))}
          {hackathon.tags.length > 3 && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs px-2 py-1 font-normal">+{hackathon.tags.length - 3}</Badge>
          )}
        </div>

        <div className="flex-grow" />

        <div className="mt-4 flex text-sm text-slate-500 justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>~{formatDate(hackathon.period.endAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{hackathon.participantCount}명</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
