'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useProductStore } from '../../store/useProductStore';

const HeaderCSR = () => {
  const { filters, setFilters, fetchProducts } = useProductStore();
  const [search, setSearch] = useState(filters.search || '');

  useEffect(() => {
    setSearch(filters.search || '');
  }, [filters.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search, page: 1 });
    fetchProducts();
  };

  return (
    <header className='bg-blue-700 py-4'>
      <div className='max-w-7xl mx-auto flex items-center justify-between px-4'>
        <div className='flex items-center gap-3'>
          <Link href='/'>
            <Image src='/file.svg' alt='Logo' width={40} height={40} className='rounded-full bg-white' />
          </Link>
          <span className='text-white text-2xl font-bold'>Akas</span>
        </div>
        <form onSubmit={handleSubmit} className='flex-1 max-w-xl mx-8'>
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Buscar productos...'
            className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
        </form>
        <div className='flex items-center gap-4'>
          <Link href='/cart' className='relative'>
            <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.52 19h8.96a2 2 0 001.87-2.3L17 13M7 13V6a4 4 0 014-4h0a4 4 0 014 4v7'
              />
            </svg>
          </Link>
          <Link href='/profile' className='bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold'>
            Perfil
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderCSR;
