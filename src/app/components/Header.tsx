import React from 'react';
import Link from 'next/link';
import LogoAkas from './LogoAkas';

const Header: React.FC = () => {
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
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L5 7m2 6v8a2 2 0 002 2h8a2 2 0 002-2v-8M7 13l-2-6m0 0h16'
                />
              </svg>
              {/* Cart badge */}
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                0
              </span>
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
