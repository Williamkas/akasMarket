import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/' className='flex items-center'>
              <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3'>
                <span className='text-white font-bold text-lg'>A</span>
              </div>
              <h1 className='text-xl font-semibold text-gray-900'>Akas</h1>
            </Link>
          </div>

          {/* Search Bar - Solo visible en desktop */}
          <div className='hidden md:flex flex-1 max-w-2xl mx-8'>
            <div className='relative w-full'>
              <input
                type='text'
                placeholder='Search for products...'
                className='w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
              />
              <button className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right side actions */}
          <div className='flex items-center space-x-4'>
            {/* Mobile search button */}
            <button className='md:hidden p-2 text-gray-600 hover:text-gray-900'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </button>

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

        {/* Mobile search bar */}
        <div className='md:hidden pb-4'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search for products...'
              className='w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
            />
            <button className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
