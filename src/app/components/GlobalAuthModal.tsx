'use client';
import { useUiStore } from '@/store/useUiStore';
import AuthModal from './AuthModal';

export default function GlobalAuthModal() {
  const showLoginModal = useUiStore((s) => s.showLoginModal);
  const closeLoginModal = useUiStore((s) => s.closeLoginModal);

  return (
    <AuthModal
      isOpen={showLoginModal}
      onClose={closeLoginModal}
      onSuccess={closeLoginModal}
      title='Iniciar sesión'
      description='Inicia sesión o crea una cuenta para acceder a tu perfil.'
    />
  );
}
