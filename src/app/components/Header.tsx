'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LogoAkas from './LogoAkas';
import { useCartStore } from '../../store/useCartStore';

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

const Header: React.FC = () => {
  const cartCount = useCartStore((state) => state.getCartCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/' className='flex items-center'>
              <span
                className='mr-3 bg-blue-600 rounded-full flex items-center justify-center'
                style={{ width: 40, height: 40 }}
              >
                <LogoAkas width={28} height={28} />
              </span>
              <h1 className='text-xl font-semibold text-gray-900'>Akas</h1>
            </Link>
          </div>

          {/* Right side actions */}
          <div className='flex items-center space-x-4'>
            {/* Cart */}
            <Link href='/cart' className='relative p-2 text-gray-600 hover:text-gray-900'>
              <CartIcon />
              {/* Cart badge - only show when count > 0 and mounted */}
              {mounted && cartCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile/Login */}
            <Link href='/api/auth/logout'>
              <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium'>
                Perfil
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
