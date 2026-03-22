'use client';

import { useEffect, useRef } from 'react';
import { initializeIfNeeded } from '@/store/initializer';

export default function StoreInitializer() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initializeIfNeeded();
    }
  }, []);

  return null;
}
