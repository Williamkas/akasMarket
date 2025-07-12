'use client';

import { useAuth } from '@/store/useAuthStore';
import HeaderSSR from './HeaderSSR';
import HeaderCSR from './HeaderCSR';

export default function HeaderWrapper() {
  const { isAuthenticated, hydrated, user } = useAuth();

  console.log('HeaderWrapper state:', { isAuthenticated, hydrated, user });

  // Show loading state while hydrating
  if (!hydrated) {
    return <HeaderSSR />;
  }

  // If user is authenticated, show CSR header with "Mi cuenta"
  if (isAuthenticated) {
    return <HeaderCSR />;
  }

  // If user is not authenticated, show SSR header with "Ingresar"
  return <HeaderSSR />;
}
