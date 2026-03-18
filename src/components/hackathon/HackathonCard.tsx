'use client'
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users } from 'lucide-react';

import type { Hackathon } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getDday, formatDate } from '@/lib/date';
import { getStatusColor } from '@/lib/utils';

interface HackathonCardProps {
  hackathon: Hackathon;
}

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  const statusText = hackathon.status === 'ongoing' ? '진행중' : hackathon.status === 'ended' ? '종료' : '예정';

  return (
    <Link href={hackathon.links.detail} className="block group">
      <Card className="flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-1 border border-slate-100">
        <div className="relative">
          <Image
            src={hackathon.thumbnailUrl}
            alt={hackathon.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <Badge className={`text-white ${getStatusColor(hackathon.status)}`}>
              {statusText}
            </Badge>
            {hackathon.status === 'ongoing' && (
              <Badge variant="destructive">{getDday(hackathon.period.submissionDeadlineAt)}</Badge>
            )}
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-lg font-bold leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">
            {hackathon.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2">
            {hackathon.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="text-sm text-slate-500 justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(hackathon.period.submissionDeadlineAt)} 마감</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{hackathon.participantCount}명 참여</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
