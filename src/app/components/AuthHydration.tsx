'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthHydration() {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return null;
}
