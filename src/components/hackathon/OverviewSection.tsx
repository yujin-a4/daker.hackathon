'use client';

import type { HackathonDetail } from '@/types';
import { Users, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type OverviewSectionProps = {
  overview: HackathonDetail['sections']['overview'];
};

export default function OverviewSection({ overview }: OverviewSectionProps) {
  return (
    <div className="space-y-10">
      <div className="relative p-6 md:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
        <p className="relative z-10 text-base md:text-[17px] text-slate-700 dark:text-slate-300 leading-relaxed">
          {overview.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { 
            label: "참가 형태", 
            value: overview.teamPolicy.allowSolo ? "개인/팀 모두 가능" : "팀 참가만 가능", 
            icon: Users,
            sub: "다양한 구성으로 도전하세요"
          },
          { 
            label: "최대 팀 규모", 
            value: `${overview.teamPolicy.maxTeamSize}명`, 
            icon: UserPlus,
            sub: "풍부한 협업이 가능합니다"
          }
        ].map((policy) => (
          <Card key={policy.label} className="bg-white dark:bg-slate-950 rounded-2xl p-6 border-slate-200 dark:border-slate-800 hover:border-indigo-300 transition-colors">
            <CardContent className="flex gap-5 items-start p-0">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl">
                <policy.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{policy.label}</p>
                <p className="text-lg font-extrabold text-slate-800 dark:text-slate-200">
                  {policy.value}
                </p>
                <p className="text-xs text-muted-foreground">{policy.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
