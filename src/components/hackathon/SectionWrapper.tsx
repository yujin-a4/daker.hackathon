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
    <section id={id} className={cn("py-8 md:py-10 scroll-mt-20", className)}>
      <div className="mb-8 pb-4 border-b">
        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-800">
          <Icon className="w-6 h-6 text-indigo-500" />
          <span>{title}</span>
        </h2>
      </div>
      {children}
    </section>
  );
};

export default SectionWrapper;
