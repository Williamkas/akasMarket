'use client';

import { useAuth } from '@/store/useAuthStore';
import HeaderSSR from './HeaderSSR';
import HeaderCSR from './HeaderCSR';

export default function HeaderWrapper() {
  const { isAuthenticated, hydrated } = useAuth();

  // Show SSR header while hydrating or if not authenticated
  // The HeaderSSR now includes IngresarButton which handles authentication logic
  if (!hydrated || !isAuthenticated) {
    return <HeaderSSR />;
  }

  // If user is authenticated, show CSR header with "Mi cuenta"
  return <HeaderCSR />;
}
