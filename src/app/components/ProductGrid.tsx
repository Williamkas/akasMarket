'use client';

import React from 'react';
import ProductCard from './ProductCard';
import PaginationControls from './PaginationControls';
import type { Product } from '../../types/product';
import { useProductStore } from '../../store/useProductStore';

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

interface ProductGridProps {
  products: Product[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

const ProductCardSkeleton = () => (
  <div className='animate-pulse bg-white p-4 rounded-lg shadow flex flex-col'>
    <div className='bg-gray-200 h-48 w-full rounded mb-4'></div>
    <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
    <div className='h-3 bg-gray-100 rounded w-1/2 mb-2'></div>
    <div className='h-4 bg-gray-200 rounded w-1/3'></div>
  </div>
);

const ProductGrid: React.FC<ProductGridProps> = ({ products, pagination, loading, error }) => {
  const { setFilters, fetchProducts } = useProductStore();

  const handlePageChange = (page: number) => {
    setFilters({ page });
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className='w-full space-y-6'>
      {/* Products List */}
      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className='bg-white p-8 rounded-lg shadow text-center text-red-500'>{error}</div>
      ) : products.length === 0 ? (
        <div className='bg-white p-8 rounded-lg shadow text-center text-gray-500'>
          No se encontraron productos. Prueba ajustando tu búsqueda o los filtros.
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {products.map((product) => (
            <div className='bg-white rounded-lg shadow' key={product.id}>
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                imageUrl={product.main_image_url}
                status={product.status}
                delivery_type={product.delivery_type}
                onFavorite={() => {}}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          itemsPerPage={12}
          onPageChange={handlePageChange}
          label='Página'
        />
      )}
    </section>
  );
};

export default ProductGrid;
