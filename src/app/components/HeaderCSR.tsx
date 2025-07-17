'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useProductStore } from '../../store/useProductStore';
import CartIcon from './CartIcon';
import LogoAkas from './LogoAkas';
import { useAuth, useAuthStore } from '../../store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import AuthModal from './AuthModal';

const HeaderCSR = () => {
  const { filters, setFiltersAndSearch, clearFilters, fetchProducts, hydrated } = useProductStore();
  const [search, setSearch] = useState(filters.search || '');
  const { isAuthenticated, redirectUrl } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { setRedirectUrl, clearRedirectUrl } = useAuthStore();

  useEffect(() => {
    if (hydrated) {
      setSearch(filters.search || '');
    }
  }, [filters.search, hydrated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return; // No submit if empty or whitespace
    if (pathname !== '/products') {
      // Redirige a /products?search=...
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`);
    } else {
      clearFilters();
      setFiltersAndSearch({ search, page: 1 });
      fetchProducts();
    }
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      router.push('/account');
    } else {
      // Store current path for redirect after login
      setRedirectUrl(window.location.pathname);
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <header className='bg-blue-700 py-4'>
        <div className='max-w-7xl mx-auto px-4'>
          {/* Desktop Layout */}
          <div className='hidden md:flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Link href='/' className='flex items-center gap-2'>
                <span className='flex items-center justify-center' style={{ width: 40, height: 40 }}>
                  <LogoAkas width={100} height={100} />
                </span>
                <span className='text-white text-2xl font-bold cursor-pointer'>Akas Market</span>
              </Link>
            </div>
            <form onSubmit={handleSubmit} className='flex-1 max-w-xl mx-8 relative'>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Buscar productos...'
                className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10 text-black'
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
              <button
                onClick={handleAccountClick}
                className='bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold'
              >
                {isAuthenticated ? 'Mi cuenta' : 'Ingresar'}
              </button>
              <CartIcon />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className='md:hidden space-y-3'>
            {/* Top row: Logo, Profile, Cart */}
            <div className='flex items-center justify-between'>
              <Link href='/' className='flex items-center gap-2'>
                <span className='flex items-center justify-center' style={{ width: 32, height: 32 }}>
                  <LogoAkas width={80} height={80} />
                </span>
                <span className='text-white text-xl font-bold cursor-pointer'>Akas Market</span>
              </Link>
              <div className='flex items-center gap-3'>
                <button onClick={handleAccountClick} className='text-white hover:text-gray-200 transition-colors'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </button>
                <CartIcon />
              </div>
            </div>

            {/* Bottom row: Search */}
            <form onSubmit={handleSubmit} className='relative'>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Buscar productos...'
                className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10 text-black'
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

export default HeaderCSR;
