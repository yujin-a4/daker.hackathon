import type { Team, Hackathon } from '@/types';
import { Calendar, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function BasecampInfoTab({
  team,
  hackathon,
}: {
  team: Team;
  hackathon: Hackathon;
}) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={team.isOpen ? 'default' : 'secondary'} className="px-2">
            {team.isOpen ? '모집중' : '모집완료'}
          </Badge>
          <h2 className="text-2xl font-bold">{team.name}</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-4 bg-muted/30 p-4 rounded-lg border">
          {team.intro}
        </p>
      </div>

      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <span className="p-1.5 bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300 flex items-center justify-center rounded-md">
            🏆
          </span>
          참가 중인 해커톤
        </h3>
        <p className="font-medium text-lg">{hackathon.title}</p>
        <div className="flex items-center text-sm text-muted-foreground mt-2 gap-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(hackathon.period.submissionDeadlineAt)} 제출 마감
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <span className="p-1.5 bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300 flex items-center justify-center rounded-md">
            📅
          </span>
          해커톤 일정 타임라인
        </h3>
        <div className="relative pt-6 pb-2">
          {/* Timeline Track */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 w-[60%]" />
          </div>
          
          <div className="relative flex justify-between">
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-blue-600 border-4 border-background shrink-0 z-10" />
              <div className="mt-3 text-sm font-semibold whitespace-nowrap">접수 마감</div>
              <div className="text-xs text-muted-foreground mt-0.5">완료</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-blue-600 border-4 border-background shrink-0 z-10" />
              <div className="mt-3 text-sm font-semibold whitespace-nowrap text-blue-600 dark:text-blue-400">제출 마감</div>
              <div className="text-xs text-muted-foreground mt-0.5">{formatDate(hackathon.period.submissionDeadlineAt)}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-muted border-4 border-background shrink-0 z-10" />
              <div className="mt-3 text-sm font-medium whitespace-nowrap text-muted-foreground">결과 발표</div>
              <div className="text-xs text-muted-foreground mt-0.5">{formatDate(hackathon.period.endAt)}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <span className="p-1.5 bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300 flex items-center justify-center rounded-md">
            👥
          </span>
          필요 역할 및 인원
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {team.lookingFor?.map((role, idx) => (
            <div key={idx} className="border p-4 rounded-lg bg-card flex flex-col items-center text-center gap-2">
               <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-1">
                 <Users className="w-5 h-5 text-muted-foreground" />
               </div>
               <span className="font-medium text-sm block">{role.position}</span>
               {role.description && <span className="text-xs text-muted-foreground line-clamp-2 mt-1">{role.description}</span>}
            </div>
          ))}
          {(!team.lookingFor || team.lookingFor.length === 0) && (
            <div className="col-span-full py-8 text-center text-muted-foreground bg-muted/20 border-dashed border rounded-xl">
              별도 모집 역할 없음
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
