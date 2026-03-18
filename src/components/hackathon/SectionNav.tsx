'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

type Section = {
  id: string;
  label: string;
};

type SectionNavProps = {
  sections: Section[];
  activeSection: string;
};

export default function SectionNav({ sections, activeSection }: SectionNavProps) {
  const isMobile = useIsMobile();
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isMobile && activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeSection, isMobile]);

  const handleNavItemClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        const yOffset = -80; // for sticky header
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
  };
  
  if (isMobile) {
    return (
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm">
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex px-2 border-b">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  ref={isActive ? activeTabRef : null}
                  onClick={() => handleNavItemClick(section.id)}
                  className={cn(
                    'px-3.5 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                    isActive
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent'
                  )}
                >
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-56 sticky top-20 h-fit hidden md:block">
      <nav>
        <ul className="space-y-1">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavItemClick(section.id);
                  }}
                  className={cn(
                    'block pl-5 pr-2 py-2 text-sm rounded-r-md transition-all',
                    isActive
                      ? 'border-l-4 border-indigo-500 text-indigo-600 font-semibold bg-indigo-50'
                      : 'border-l-4 border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
