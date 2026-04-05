'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, HelpCircle, ShieldAlert } from 'lucide-react';

interface DocumentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'rules' | 'faq';
  hackathonTitle: string;
}

export default function DocumentModal({ isOpen, onOpenChange, type, hackathonTitle }: DocumentModalProps) {
  const isRules = type === 'rules';
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl px-0 pb-0 overflow-hidden bg-white dark:bg-slate-950 border-none shadow-2xl">
        <DialogHeader className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="flex items-center gap-4 relative z-10">
            <div className={`p-3 rounded-xl shadow-sm ${isRules ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
              {isRules ? <FileText className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
            </div>
            <div className="space-y-1 text-left">
              <DialogTitle className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                {isRules ? '대회 규정 가이드' : '자주 묻는 질문 (FAQ)'}
              </DialogTitle>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate max-w-[280px] md:max-w-[400px]">{hackathonTitle}</p>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh]">
          <div className="px-6 py-8">
            {isRules ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-8">
                <section className="space-y-4 bg-white dark:bg-slate-900 p-0">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <ShieldAlert className="w-5 h-5 text-rose-500"/> 기본 규칙
                  </h3>
                  <ul className="space-y-3 text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <li className="flex gap-2"><span className="text-indigo-500 font-bold">•</span> 본 해커톤에서 제출되는 모든 결과물의 저작권은 참가자 본인에게 있습니다.</li>
                    <li className="flex gap-2"><span className="text-indigo-500 font-bold">•</span> 타인의 코드를 무단 도용하거나 표절한 사실이 발견될 경우, 발각 즉시 자격이 박탈되며 향후 대회 참여가 제한됩니다.</li>
                    <li className="flex gap-2"><span className="text-indigo-500 font-bold">•</span> 모든 팀은 마감 시간 전까지 최소 1회 이상의 정상적인 작동을 증명할 수 있는 결과물을 제출해야 합니다.</li>
                  </ul>
                </section>
                
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">팀 구성 규정</h3>
                  <ul className="space-y-3 text-[15px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" /> 팀장 1인을 포함하여 최소 2인, 최대 5인까지 팀을 구성할 수 있습니다. (개인 참가 가능 대회 예외)</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" /> 팀원 변경은 대회 시작 후 24시간 이내에만 가능하며, 이후로는 불가합니다.</li>
                  </ul>
                </section>
                
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">평가 기준</h3>
                  <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    심사는 독창성(30%), 구현 완성도(30%), 실용성(20%), 프레젠테이션(20%)을 기준으로 진행되며, 동점자 발생 시 독창성 점수가 높은 팀을 우선합니다.
                  </p>
                </section>
                
                <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-xl text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-8">
                  💡 이는 데모용 규정 페이지로, 실제 해커톤의 경우 구체적인 데이터가 연동됩니다.
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-8">
                <div className="space-y-3 group">
                  <h4 className="flex gap-2 font-bold text-[16px] text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                    <span className="text-emerald-500 font-black">Q.</span> 여러 해커톤에 동시 지원할 수 있나요?
                  </h4>
                  <p className="text-[15px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                    네, 가능합니다. 다만 일정이 겹치는 경우, 원활한 프로젝트 참여를 위해 본인의 스케줄을 잘 관리하시길 권장합니다. 각 플랫폼 규정에 위배되지 않는 선에서 자유롭게 참여할 수 있습니다.
                  </p>
                </div>
                
                <div className="space-y-3 group">
                  <h4 className="flex gap-2 font-bold text-[16px] text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                    <span className="text-emerald-500 font-black">Q.</span> 이미 완성된 기존 프로젝트로 참여해도 되나요?
                  </h4>
                  <p className="text-[15px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                    불가합니다. 본 해커톤은 대회 기간 내 새롭게 기획되고 개발된 프로젝트만을 심사 대상으로 합니다. 오픈소스를 활용할 수는 있으나, 주된 핵심 기능은 대회 기간 중에 구현되어야 합니다.
                  </p>
                </div>
                
                <div className="space-y-3 group">
                  <h4 className="flex gap-2 font-bold text-[16px] text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                    <span className="text-emerald-500 font-black">Q.</span> 시상금은 언제 어떻게 지급되나요?
                  </h4>
                  <p className="text-[15px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                    최종 결과 발표 후 2주 이내에 팀장 명의의 계좌로 일괄 지급됩니다. 단, 제세공과금(4.4%)은 당첨자 본인 부담으로 제외 후 입금됩니다.
                  </p>
                </div>
                
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-xl text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-8">
                  💡 이는 데모용 FAQ 페이지로, 실제 해커톤의 경우 구체적인 데이터가 연동됩니다.
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
