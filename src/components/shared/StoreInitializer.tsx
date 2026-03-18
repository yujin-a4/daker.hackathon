'use client';

import { useEffect, useRef } from 'react';
import { initializeStore } from '@/store/initializer';

function StoreInitializer() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initializeStore();
      initialized.current = true;
    }
  }, []);

  return null;
}

export default StoreInitializer;
