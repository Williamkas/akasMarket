'use client';

import { useEffect, useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import ProductGrid from '../components/ProductGrid';
import ProductSortOptions from '../components/ProductSortOptions';
import ProductFilters from '../components/ProductFilters';
import { useSearchParams } from 'next/navigation';
import Breadcrumb from '../components/Breadcrumb';
import { useAuth, useAuthStore } from '../../store/useAuthStore';
import AuthModal from '../components/AuthModal';

export default function ProductsPage() {
  const { fetchProducts, products, pagination, loading, error, filters, setFilters, hydrated } = useProductStore();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { setRedirectUrl, clearRedirectUrl } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!hydrated) return; // Don't fetch until hydrated

    const searchFromUrl = searchParams.get('search') || '';
    let categoriesFromUrl: string[] = [];
    const catParam = searchParams.getAll('categories');
    if (catParam.length > 0) {
      categoriesFromUrl = catParam;
    }

    // Solo actualiza si hay diferencia
    const shouldUpdate =
      searchFromUrl !== filters.search ||
      (categoriesFromUrl.length > 0 && filters.categories?.join(',') !== categoriesFromUrl.join(','));

    if (shouldUpdate) {
      // Si hay parámetros de búsqueda, marcar como búsqueda
      const hasSearchParams = searchFromUrl || categoriesFromUrl.length > 0;
      if (hasSearchParams) {
        setFilters({ search: searchFromUrl, categories: categoriesFromUrl, page: 1 });
      } else {
        // Si no hay parámetros, solo actualizar sin marcar como búsqueda
        setFilters({ search: searchFromUrl, categories: categoriesFromUrl, page: 1 });
      }
      fetchProducts();
    } else {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, hydrated]);

  // Check if user came from home and is not authenticated
  useEffect(() => {
    console.log('Auth check effect:', { hydrated, isAuthenticated });

    if (hydrated && !isAuthenticated) {
      // Check URL parameter first (more reliable)
      const fromHomeParam = searchParams.get('from');
      const isFromHomeParam = fromHomeParam === 'home';

      // Fallback to referrer check
      const referrer = document.referrer;
      const currentOrigin = window.location.origin;
      const currentPath = window.location.pathname;

      console.log('Auth check:', {
        fromHomeParam,
        isFromHomeParam,
        referrer,
        currentOrigin,
        currentPath,
        referrerIncludesOrigin: referrer.includes(currentOrigin),
        referrerEndsWithSlash: referrer.endsWith('/'),
        referrerEqualsOrigin: referrer === currentOrigin,
        referrerEqualsOriginSlash: referrer === currentOrigin + '/'
      });

      const isFromHomeReferrer =
        referrer.includes(currentOrigin) &&
        (referrer.endsWith('/') || referrer === currentOrigin || referrer === currentOrigin + '/');

      const isFromHome = isFromHomeParam || isFromHomeReferrer;
      console.log('Is from home:', isFromHome);

      if (isFromHome) {
        console.log('Opening auth modal from home');
        setRedirectUrl('/products');

        // Clean up the URL parameter if it exists
        if (isFromHomeParam) {
          const url = new URL(window.location.href);
          url.searchParams.delete('from');
          window.history.replaceState({}, '', url.toString());
        }

        // Small delay to make the modal opening feel more natural
        setTimeout(() => {
          setShowAuthModal(true);
        }, 500);
      }
    }
  }, [hydrated, isAuthenticated, setRedirectUrl, searchParams]);

  // Don't render until hydrated to prevent hydration mismatch
  if (!hydrated) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Obtener categorías únicas de los productos para los filtros
  const categories = Array.from(
    new Set(
      products.flatMap((p) =>
        Array.isArray(p.categories) ? p.categories.filter((c) => c && c !== 'Uncategorized') : []
      )
    )
  ).sort();

  return (
    <>
      <Breadcrumb />
      {/* Título y cantidad de resultados */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Productos</h1>
        <span className='text-gray-600 text-sm'>{pagination.totalCount} resultados encontrados</span>
      </div>
      <div className='flex flex-col lg:flex-row gap-8 items-start'>
        {/* Sidebar */}
        <aside className='w-full lg:w-1/4'>
          <div className='sticky top-4 space-y-6'>
            <ProductSortOptions label='Ordenar por:' />
            <ProductFilters categories={categories} label='Filtrar por:' />
          </div>
        </aside>
        {/* Main Content */}
        <section className='w-full lg:w-3/4 flex-1 space-y-6'>
          <ProductGrid products={products} pagination={pagination} loading={loading} error={error} />
        </section>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          clearRedirectUrl();
        }}
        onSuccess={() => {
          setShowAuthModal(false);
          clearRedirectUrl();
        }}
        title='Iniciar sesión'
        description='Inicia sesión o crea una cuenta para acceder a tu perfil.'
      />
    </>
  );
}
