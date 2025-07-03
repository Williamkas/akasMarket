'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  categories: string[];
  main_image_url: string;
}

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  totalCount?: number;
  error?: string | null;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/products/${product.id}`);
  };
  return (
    <div
      className='bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer'
      onClick={handleClick}
      role='button'
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter') handleClick();
      }}
    >
      {/* Product Image */}
      <div className='relative h-48 bg-gray-100 overflow-hidden'>
        <Image
          src={product.main_image_url || '/placeholder-product.jpg'}
          alt={product.title}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-300'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
        />
        {/* Quick actions overlay */}
        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-end justify-end p-3'>
          <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2'>
            <button className='bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                />
              </svg>
            </button>
            <button className='bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className='p-4'>
        <div className='mb-2'>
          <h3 className='text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors'>
            {product.title}
          </h3>
          <p className='text-gray-600 text-sm mt-1 line-clamp-2'>{product.description}</p>
        </div>

        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className='mb-3'>
            <div className='flex flex-wrap gap-1'>
              {product.categories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className='inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full'
                >
                  {category}
                </span>
              ))}
              {product.categories.length > 2 && (
                <span className='inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full'>
                  +{product.categories.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price and Actions */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <span className='text-2xl font-bold text-gray-900'>${product.price.toFixed(2)}</span>
          </div>
          <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm'>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductListSkeleton: React.FC = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className='bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse'>
          <div className='h-48 bg-gray-200'></div>
          <div className='p-4'>
            <div className='h-4 bg-gray-200 rounded mb-2'></div>
            <div className='h-3 bg-gray-200 rounded mb-4 w-3/4'></div>
            <div className='flex justify-between items-center'>
              <div className='h-6 bg-gray-200 rounded w-20'></div>
              <div className='h-8 bg-gray-200 rounded w-24'></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductList: React.FC<ProductListProps> = ({ products, loading = false, totalCount = 0, error }) => {
  if (loading) {
    return <ProductListSkeleton />;
  }

  if (error) {
    return (
      <div className='bg-white rounded-lg border border-red-300 p-12 text-center text-red-700'>
        <h3 className='text-lg font-semibold mb-2'>Error al cargar productos</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className='bg-white rounded-lg border border-gray-200 p-12 text-center'>
        <div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
          <svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
            />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>No products found</h3>
        <p className='text-gray-600'>Try adjusting your search or filter criteria to find what you`re looking for.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Results header */}
      <div className='flex items-center justify-between'>
        <p className='text-gray-600'>
          Showing <span className='font-medium text-gray-900'>{products.length}</span>
          {totalCount > 0 && (
            <>
              {' '}
              of <span className='font-medium text-gray-900'>{totalCount}</span>
            </>
          )}{' '}
          products
        </p>
      </div>

      {/* Products grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
