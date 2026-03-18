'use client';

import { useState, useEffect, useRef } from 'react';

export function useScrollSpy(
  selectors: string[],
  options?: IntersectionObserverInit
): string {
  const [activeId, setActiveId] = useState<string>('');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Fallback for server-side rendering
    if (typeof window === 'undefined' || !window.document) {
      return;
    }

    const elements = selectors
      .map((selector) => document.querySelector(selector))
      .filter((el): el is Element => el !== null);

    if (observer.current) {
      observer.current.disconnect();
    }

    let initialId = '';
    if (elements.length > 0) {
      initialId = elements[0].id;
    }

    observer.current = new IntersectionObserver((entries) => {
      let found = false;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
          found = true;
        }
      });
       if (!found && entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          if (lastEntry.boundingClientRect.y < 0) {
            setActiveId(lastEntry.target.id);
          }
      }
    }, options);

    elements.forEach((el) => {
      observer.current?.observe(el);
    });

    if (initialId && !activeId) {
        setActiveId(initialId);
    }

    return () => observer.current?.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectors.join(','), options]);

  return activeId;
}
