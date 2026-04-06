'use client';

import type { HackathonDetail } from '@/types';
import { AlertTriangle, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type InfoSectionProps = {
  info: HackathonDetail['sections']['info'];
  onOpenDoc?: (type: 'rules' | 'faq') => void;
};

export default function InfoSection({ info, onOpenDoc }: InfoSectionProps) {
  return (
    <>
      <div className="bg-amber-50/80 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50 rounded-xl p-6 mb-8">
        <ul className="space-y-3">
          {info.notice.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <span className="text-amber-900 dark:text-amber-200">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-4">
        {onOpenDoc ? (
          <>
            <Button onClick={() => onOpenDoc('rules')} variant="outline" className="bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700">
              <FileText className="mr-2 h-4 w-4" />
              규정 보기
            </Button>
            <Button onClick={() => onOpenDoc('faq')} variant="outline" className="bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700">
              <HelpCircle className="mr-2 h-4 w-4" />
              FAQ 보기
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="outline" className="bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700">
              <Link href={info.links.rules} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                규정 보기
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700">
              <Link href={info.links.faq} target="_blank" rel="noopener noreferrer">
                <HelpCircle className="mr-2 h-4 w-4" />
                FAQ 보기
              </Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
}
