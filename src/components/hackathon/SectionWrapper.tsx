import { cn } from '@/lib/utils';
import React from 'react';

type SectionWrapperProps = {
  id: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
};

const SectionWrapper = ({ id, icon: Icon, title, children, className }: SectionWrapperProps) => {
  return (
    <section id={id} className={cn("py-6 md:py-8 scroll-mt-20", className)}>
      <div className="mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-800 dark:text-slate-100">
          <Icon className="w-5 h-5 text-indigo-500" />
          <span>{title}</span>
        </h2>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
