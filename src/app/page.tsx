'use client';

import React, { useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProductSearchBar from './components/ProductSearchBar';
import ProductSortOptions from './components/ProductSortOptions';
import ProductFilters from './components/ProductFilters';
import ProductList from './components/ProductList';
import PaginationControls from './components/PaginationControls';
import { useProductStore } from '../store/useProductStore';

export default function Home() {
  const { products, loading, filters, pagination, setFilters, fetchProducts, error } = useProductStore();

  // Effect to fetch products when filters change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Handle search change
  const handleSearchChange = useCallback(
    (search: string) => {
      setFilters({ search, page: 1 });
    },
    [setFilters]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (sortBy: string, order: 'asc' | 'desc') => {
      setFilters({ sortBy, order, page: 1 });
    },
    [setFilters]
  );

  // Handle filters change
  const handleFiltersChange = React.useCallback(
    (filtersUpdate: { priceRange?: { min?: number; max?: number }; categories?: string[] }) => {
      setFilters({
        ...(filtersUpdate.priceRange
          ? {
              minPrice: filtersUpdate.priceRange.min,
              maxPrice: filtersUpdate.priceRange.max
            }
          : {}),
        ...(filtersUpdate.categories ? { categories: filtersUpdate.categories } : {}),
        page: 1
      });
    },
    [setFilters]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setFilters({ page });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setFilters]
  );

  // Obtener categorías únicas de los productos, solo válidas
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (Array.isArray(p.categories)) {
        p.categories.forEach((cat) => {
          if (cat && cat !== 'Uncategorized') set.add(cat);
        });
      }
    });
    return Array.from(set).sort();
  }, [products]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Breadcrumb */}
        <nav className='flex items-center space-x-2 text-sm text-gray-600 mb-6'>
          <Link href='/' className='hover:text-gray-900 transition-colors'>
            Home
          </Link>

          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
          <span className='text-gray-900 font-medium'>Products</span>
        </nav>

        {/* Results count */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>All Products</h1>
          <p className='text-gray-600'>
            {loading
              ? 'Loading products...'
              : `${pagination.totalCount} result${pagination.totalCount !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Error feedback visual */}
        {error && (
          <div className='mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded'>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar Filters */}
          <aside className='w-full lg:w-1/4'>
            <div className='sticky top-4'>
              <ProductFilters onFiltersChange={handleFiltersChange} categories={categories} />
            </div>
          </aside>

          {/* Main Content */}
          <section className='w-full lg:w-3/4 space-y-6'>
            {/* Search Bar */}
            <ProductSearchBar onSearchChange={handleSearchChange} initialValue={filters.search} />

            {/* Sort Options */}
            <ProductSortOptions
              onSortChange={handleSortChange}
              currentSort={filters.sortBy}
              currentOrder={filters.order}
            />

            {/* Products List */}
            <ProductList products={products} loading={loading} totalCount={pagination.totalCount} error={error} />

            {/* Pagination */}
            {!loading && products.length > 0 && (
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalCount={pagination.totalCount}
                itemsPerPage={filters.limit || 12}
                onPageChange={handlePageChange}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
