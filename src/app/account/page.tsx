'use client';

import React, { useState } from 'react';
import { useAuth } from '../../store/useAuthStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '../components/Breadcrumb';
import HeaderCSR from '../components/HeaderCSR';
import FavoritesList from '../components/FavoritesList';
import { useSearchParams } from 'next/navigation';
import { useFavoritesHydration } from '../../store/useFavoritesStore';
import { useCartStore } from '../../store/useCartStore';
import { useProductStore } from '../../store/useProductStore';

const AccountPage: React.FC = () => {
  const { isAuthenticated, user, hydrated: authHydrated } = useAuth();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'profile' | 'favorites' | 'orders') || 'profile';
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'orders'>(initialTab);
  useFavoritesHydration();
  const { hydrated: cartHydrated } = useCartStore();
  const { products, fetchProducts } = useProductStore();

  React.useEffect(() => {
    if (authHydrated && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authHydrated, router]);

  // Sincroniza el tab activo con la query
  React.useEffect(() => {
    const tab = (searchParams.get('tab') as 'profile' | 'favorites' | 'orders') || 'profile';
    setActiveTab(tab);
  }, [searchParams]);

  // Si los productos están vacíos, haz fetch al entrar a la página o al cambiar a favoritos
  React.useEffect(() => {
    if (activeTab === 'favorites' && products.length === 0) {
      fetchProducts();
    }
  }, [activeTab, products.length, fetchProducts]);

  if (!authHydrated || !cartHydrated) {
    return (
      <>
        <HeaderCSR />
        <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Cargando...</p>
          </div>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleTabChange = (tab: 'profile' | 'favorites' | 'orders') => {
    setActiveTab(tab);
    router.replace(`/account?tab=${tab}`);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <HeaderCSR />
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <Breadcrumb />

        {/* Header */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Mi Cuenta</h1>
            <p className='text-gray-600'>Bienvenido, {user?.name || user?.user_metadata?.name || 'Usuario'}</p>
          </div>
          <button
            onClick={handleLogout}
            className='px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200'
          >
            Cerrar sesión
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className='bg-white rounded-lg shadow-sm mb-6'>
          <div className='border-b border-gray-200'>
            <nav className='flex space-x-8 px-6'>
              <button
                onClick={() => handleTabChange('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mis datos
              </button>
              <button
                onClick={() => handleTabChange('favorites')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'favorites'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mis favoritos
              </button>
              <button
                onClick={() => handleTabChange('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mis compras
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className='p-6'>
            {activeTab === 'profile' && (
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-900'>Información Personal</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Nombre</label>
                    <input
                      type='text'
                      defaultValue={user?.name || user?.user_metadata?.name || ''}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Apellido</label>
                    <input
                      type='text'
                      defaultValue={user?.lastname || user?.user_metadata?.lastname || ''}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                    <input
                      type='email'
                      defaultValue={user?.email || ''}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      disabled
                    />
                  </div>
                </div>
                <div className='flex justify-end space-x-4'>
                  <button className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'>Cancelar</button>
                  <button className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                    Guardar cambios
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-900'>Mis Favoritos</h2>
                <FavoritesList />
              </div>
            )}

            {activeTab === 'orders' && (
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-900'>Mis Compras</h2>
                <div className='text-center py-12'>
                  <svg
                    className='mx-auto h-12 w-12 text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                    />
                  </svg>
                  <h3 className='mt-2 text-sm font-medium text-gray-900'>No tienes compras</h3>
                  <p className='mt-1 text-sm text-gray-500'>Realiza tu primera compra para ver el historial aquí.</p>
                  <div className='mt-6'>
                    <Link
                      href='/products'
                      className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
                    >
                      Comprar productos
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
