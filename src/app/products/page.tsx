'use client';

import { useEffect } from 'react';
import { useProductStore } from '../../store/useProductStore';
import ProductGrid from '../components/ProductGrid';
import ProductSortOptions from '../components/ProductSortOptions';
import ProductFilters from '../components/ProductFilters';
import { useSearchParams } from 'next/navigation';

export default function ProductsPage() {
  const { fetchProducts, products, pagination, loading, error, filters, setFilters } = useProductStore();
  const searchParams = useSearchParams();

  useEffect(() => {
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
  }, [searchParams]);

  // Obtener categorías únicas de los productos para los filtros
  const categories = Array.from(
    new Set(
      products.flatMap((p) =>
        Array.isArray(p.categories) ? p.categories.filter((c) => c && c !== 'Uncategorized') : []
      )
    )
  ).sort();

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
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
      </div>
    </div>
  );
}
