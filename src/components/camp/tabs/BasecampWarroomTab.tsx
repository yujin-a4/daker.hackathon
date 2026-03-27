'use client';

import { useSubmissionStore } from '@/store/useSubmissionStore';
import type { Team, Hackathon } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, FileText, Globe, Presentation, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/date';

export default function BasecampWarroomTab({
  team,
  hackathon,
}: {
  team: Team;
  hackathon: Hackathon;
}) {
  const router = useRouter();
  const { submissions } = useSubmissionStore();

  const mySubmission = submissions.find(
    (s) => s.teamCode === team.teamCode && s.hackathonSlug === hackathon.slug
  );

  // 현재 데모에서는 제출 폼(SubmitSection)이 하나로 통합되어 있으므로, 
  // 실제 daker 뷰처럼 3가지 카드로 보여주지만 클릭하면 통합 제출로 이동하도록 합니다.
  const isPlanDone = mySubmission?.artifacts?.some(a => a.type === 'text' && a.content && a.content.length > 0);
  const isWebDone = mySubmission?.artifacts?.some(a => a.type === 'url' && a.content && a.content.length > 0);
  const isPptDone = mySubmission?.artifacts?.some(a => a.fileName);

  const cards = [
    {
      id: 'plan',
      title: '기획서 제출',
      icon: FileText,
      desc: '프로젝트의 기획서 및 계획을 작성하세요.',
      deadline: hackathon.period.submissionDeadlineAt,
      isSubmitted: isPlanDone,
    },
    {
      id: 'web',
      title: '최종 웹링크 제출',
      icon: Globe,
      desc: '개발 결과물 및 코드 저장소 링크를 공유하세요.',
      deadline: hackathon.period.submissionDeadlineAt,
      isSubmitted: isWebDone,
    },
    {
      id: 'ppt',
      title: '최종 솔루션 PPT 제출',
      icon: Presentation,
      desc: '발표 자료 및 프리젠테이션을 공유하세요.',
      deadline: hackathon.period.endAt, // 최종발표 전
      isSubmitted: isPptDone,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">작전실</h2>
          <p className="text-sm text-muted-foreground">
            작전실에서 기획서 제출, 최종 웹링크, PPT를 작성한 후 해커톤 최종 제출 페이지에서 제출하세요.
          </p>
        </div>
        <Button 
          onClick={() => router.push(`/hackathons/${hackathon.slug}#submit`)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md w-full sm:w-auto"
        >
          해커톤 최종 제출 페이지 <ArrowRight className="w-4 h-4 ml-1 flex-shrink-0" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-8">
        {cards.map((card) => {
          const Icon = card.icon;
          const isDone = Boolean(card.isSubmitted);
          
          return (
            <Card key={card.id} className={`p-5 lg:p-6 flex flex-col h-full border ${isDone ? 'border-blue-500/50 bg-blue-50/10' : 'border-border'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${isDone ? 'bg-blue-100 text-blue-600' : 'bg-muted text-muted-foreground'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {isDone ? (
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> 제출 완료
                    </span>
                  ) : (
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> 미작성
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground flex-1 mb-8">
                {card.desc}
              </p>
              
              <div className="mt-auto pt-4 border-t flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-rose-500 font-semibold flex items-center gap-1">
                     <Clock className="w-3.5 h-3.5" /> 마감일
                  </span>
                  <span className="text-muted-foreground">
                    ~{formatDate(card.deadline)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground italic">
                    {isDone ? '제출이 완료되었습니다.' : '아직 작성된 내용이 없습니다.'}
                  </span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-semibold text-blue-600"
                    onClick={() => router.push(`/hackathons/${hackathon.slug}#submit`)}
                  >
                    작성하기 &rarr;
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
