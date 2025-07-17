'use client';

import { useAuth, useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthModal from './AuthModal';

interface IngresarButtonProps {
  mobile?: boolean;
}

const IngresarButton = ({ mobile = false }: IngresarButtonProps) => {
  const { isAuthenticated, redirectUrl } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { setRedirectUrl, clearRedirectUrl } = useAuthStore();

  const handleClick = () => {
    if (isAuthenticated) {
      router.push('/account');
    } else {
      // Store current path for redirect after login
      setRedirectUrl(window.location.pathname);
      setShowAuthModal(true);
    }
  };

  if (mobile) {
    return (
      <>
        <button onClick={handleClick} className='text-white hover:text-gray-200 transition-colors'>
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            />
          </svg>
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            clearRedirectUrl();
          }}
          onSuccess={() => {
            setShowAuthModal(false);
            // Redirect to stored URL or default to account page
            if (redirectUrl && redirectUrl !== '/') {
              router.push(redirectUrl);
            } else {
              router.push('/account');
            }
            clearRedirectUrl();
          }}
          title='Iniciar sesión'
          description='Inicia sesión o crea una cuenta para acceder a tu perfil.'
        />
      </>
    );
  }

  return (
    <>
      <button onClick={handleClick} className='bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold'>
        {isAuthenticated ? 'Mi cuenta' : 'Ingresar'}
      </button>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          clearRedirectUrl();
        }}
        onSuccess={() => {
          setShowAuthModal(false);
          // Redirect to stored URL or default to account page
          if (redirectUrl && redirectUrl !== '/') {
            router.push(redirectUrl);
          } else {
            router.push('/account');
          }
          clearRedirectUrl();
        }}
        title='Iniciar sesión'
        description='Inicia sesión o crea una cuenta para acceder a tu perfil.'
      />
    </>
  );
};

export default IngresarButton;
