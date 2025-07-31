'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';

export default function ResetPasswordHandler() {
  const router = useRouter();
  const { setRedirectUrl } = useAuthStore();

  useEffect(() => {
    // Verificar si hay un token de reset de contraseña en el hash
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      // Home: Reset password token detected in hash

      const urlParams = new URLSearchParams(hash.substring(1));
      const accessToken = urlParams.get('access_token');
      const type = urlParams.get('type');

      if (accessToken && type === 'recovery') {
        // Home: Opening reset password modal
        // Limpiar el hash de la URL
        window.history.replaceState(null, '', window.location.pathname);
        // Store current path for redirect after password reset
        setRedirectUrl(window.location.pathname);
        // Add token to URL params to trigger modal
        router.replace(`/?token=${accessToken}`);
      }
    }

    // Verificar si hay un parámetro reset=true en la URL
    const searchParams = new URLSearchParams(window.location.search);
    const resetParam = searchParams.get('reset');

    if (resetParam === 'true') {
      // Home: Reset parameter detected, waiting for token...
      // Clean up the reset parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('reset');
      window.history.replaceState({}, '', url.toString());
    }
  }, [router, setRedirectUrl]);

  return null; // Este componente no renderiza nada
}
