'use client';

import type { HackathonDetail } from '@/types';
import { Users, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type OverviewSectionProps = {
  overview: HackathonDetail['sections']['overview'];
};

export default function OverviewSection({ overview }: OverviewSectionProps) {
  return (
    <>
      <p className="text-lg text-slate-700 leading-relaxed mb-8">
        {overview.summary}
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-50 rounded-xl p-5 border-slate-200">
          <CardContent className="flex gap-4 items-start p-0">
            <div className="bg-white text-slate-600 p-2.5 rounded-lg border">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">참가 형태</h4>
              <p className="text-slate-600 mt-1">
                {overview.teamPolicy.allowSolo ? "개인/팀 모두 가능" : "팀 참가만 가능"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 rounded-xl p-5 border-slate-200">
          <CardContent className="flex gap-4 items-start p-0">
            <div className="bg-white text-slate-600 p-2.5 rounded-lg border">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">최대 팀 규모</h4>
              <p className="text-slate-600 mt-1">{overview.teamPolicy.maxTeamSize}명</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
