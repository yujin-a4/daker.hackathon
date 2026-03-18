'use client';

import type { HackathonDetail } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Upload } from 'lucide-react';

type EvalSectionProps = {
  evalData: HackathonDetail['sections']['eval'];
};

export default function EvalSection({ evalData }: EvalSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 font-semibold">
          {evalData.metricName}
        </Badge>
        <p className="mt-3 text-slate-600 leading-relaxed">{evalData.description}</p>
      </div>

      {evalData.scoreDisplay?.breakdown && (
        <div>
          <h3 className="font-bold text-slate-800 mb-3 text-lg">점수 구성</h3>
          <Card className="p-6 bg-slate-50 border-slate-200">
            <div className="space-y-4">
              {evalData.scoreDisplay.breakdown.map((item) => (
                <div key={item.key}>
                  <div className="flex justify-between mb-1.5 text-sm">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="text-slate-500 font-medium">{item.weightPercent}%</span>
                  </div>
                  <Progress value={item.weightPercent} className="h-2.5 bg-slate-200 [&>div]:bg-indigo-500" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {(evalData.limits?.maxRuntimeSec || evalData.limits?.maxSubmissionsPerDay) && (
        <div>
          <h3 className="font-bold text-slate-800 mb-3 text-lg">제출 제한</h3>
          <Card className="bg-slate-50 rounded-xl p-4 border-slate-200">
            <CardContent className="p-0 grid gap-3">
              {evalData.limits.maxRuntimeSec && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-slate-500 shrink-0" />
                  <span className="font-medium text-slate-600">최대 실행시간:</span>
                  <span className="text-slate-800 font-semibold">{evalData.limits.maxRuntimeSec.toLocaleString()}초</span>
                </div>
              )}
              {evalData.limits.maxSubmissionsPerDay && (
                <div className="flex items-center gap-3 text-sm">
                  <Upload className="w-5 h-5 text-slate-500 shrink-0" />
                  <span className="font-medium text-slate-600">일일 제출 횟수:</span>
                  <span className="text-slate-800 font-semibold">{evalData.limits.maxSubmissionsPerDay}회</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
