'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LogoAkas from './LogoAkas';
import { useCartStore } from '../../store/useCartStore';
import { useAuth } from '../../store/useAuthStore';
import AuthModal from './AuthModal';

const CartIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='w-7 h-7'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L7.5 15.75A2.25 2.25 0 009.664 18h7.672a2.25 2.25 0 002.164-1.75l1.286-6.429A1.125 1.125 0 0019.75 8.25H6.272m-1.166-2.978L4.5 4.5m0 0L3.75 3m.75 1.5h16.5'
    />
    <circle cx='9' cy='20' r='1.5' />
    <circle cx='17' cy='20' r='1.5' />
  </svg>
);

// Buscador en el header que navega a /products?search=...
const HeaderSearchBar = () => (
  <form action='/products' method='GET' className='w-full max-w-xl flex relative'>
    <input
      type='text'
      name='search'
      placeholder='Buscar productos...'
      className='flex-1 pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500'
      autoComplete='off'
    />
    <button type='submit' className='absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:text-blue-800'>
      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
        />
      </svg>
    </button>
  </form>
);

const Header: React.FC = () => {
  const router = useRouter();
  const cartCount = useCartStore((state) => state.getCartCount());
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      router.push('/account');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <header className='bg-[#0052cc] text-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col sm:flex-row justify-between items-center h-24 gap-4'>
            {/* Logo */}
            <div className='flex items-center'>
              <Link href='/' className='flex items-center'>
                <span className='mr-3 flex items-center justify-center' style={{ width: 40, height: 40 }}>
                  <LogoAkas width={32} height={32} />
                </span>
                <h1 className='text-xl font-semibold text-white'>Akas Market</h1>
              </Link>
            </div>

            {/* Buscador en el header */}
            <HeaderSearchBar />

            {/* Right side actions */}
            <div className='flex items-center space-x-4'>
              {/* Cart */}
              <Link href='/cart' className='relative p-2 text-white hover:text-gray-200'>
                <CartIcon />
                {/* Cart badge - only show when count > 0 and mounted */}
                {mounted && cartCount > 0 && (
                  <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile/Login */}
              <button
                onClick={handleAccountClick}
                className='bg-white text-[#0052cc] px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium'
              >
                {isAuthenticated ? 'Mi cuenta' : 'Ingresar'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          router.push('/account');
        }}
        title='Iniciar sesión'
        description='Inicia sesión o crea una cuenta para acceder a tu perfil.'
      />
    </>
  );
};

export default Header;
