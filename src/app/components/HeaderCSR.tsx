'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useProductStore } from '../../store/useProductStore';
import CartIcon from './CartIcon';

const HeaderCSR = () => {
  const { filters, setFiltersAndSearch, clearFilters, fetchProducts } = useProductStore();
  const [search, setSearch] = useState(filters.search || '');

  useEffect(() => {
    setSearch(filters.search || '');
  }, [filters.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Limpiar todos los filtros y establecer solo la búsqueda
    clearFilters();
    setFiltersAndSearch({ search, page: 1 });
    fetchProducts();
  };

  return (
    <header className='bg-blue-700 py-4'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Desktop Layout */}
        <div className='hidden md:flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Link href='/' className='flex items-center gap-2'>
              <Image src='/file.svg' alt='Logo' width={40} height={40} className='rounded-full bg-white' />
              <span className='text-white text-2xl font-bold cursor-pointer'>Akas</span>
            </Link>
          </div>
          <form onSubmit={handleSubmit} className='flex-1 max-w-xl mx-8 relative'>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Buscar productos...'
              className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10'
            />
            <button
              type='submit'
              className='absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <circle cx='11' cy='11' r='8' strokeWidth='2' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-3.5-3.5' />
              </svg>
            </button>
          </form>
          <div className='flex items-center gap-4'>
            <CartIcon />
            <Link href='/profile' className='bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold'>
              Perfil
            </Link>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden space-y-3'>
          {/* Top row: Logo, Cart, Profile */}
          <div className='flex items-center justify-between'>
            <Link href='/' className='flex items-center gap-2'>
              <Image src='/file.svg' alt='Logo' width={32} height={32} className='rounded-full bg-white' />
              <span className='text-white text-xl font-bold cursor-pointer'>Akas</span>
            </Link>
            <div className='flex items-center gap-3'>
              <CartIcon />
              <Link href='/profile' className='text-white hover:text-gray-200 transition-colors'>
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Bottom row: Search */}
          <form onSubmit={handleSubmit} className='relative'>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Buscar productos...'
              className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10'
            />
            <button
              type='submit'
              className='absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <circle cx='11' cy='11' r='8' strokeWidth='2' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-3.5-3.5' />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default HeaderCSR;
