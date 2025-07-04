'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductDetails } from '@/services/productService';
import { useCartStore } from '@/store/useCartStore';
import type { Product } from '@/services/productsService';

const BackButton = () => (
  <Link href='/' className='inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6'>
    <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
    </svg>
    Atrás
  </Link>
);

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, items } = useCartStore();
  const cartItem = items.find((item) => item.product.id === productId);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getProductDetails(productId);
        const result = await response.json();
        if (result.success && result.data) {
          setProduct(result.data);
        } else {
          setError(result.error?.message || 'Product not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  const handleBuyNow = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      router.push('/cart');
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(e.target.value));
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Product Not Found</h1>
          <p className='text-gray-600 mb-6'>{error || 'The product you are looking for does not exist.'}</p>
          <Link
            href='/'
            className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Stock máximo (si no hay stock, deshabilitar botones)
  const maxStock = typeof product.stock === 'number' ? product.stock : 10;
  const availableStock = maxStock - (cartItem?.quantity || 0);
  const canAdd = availableStock > 0;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <BackButton />

        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-8'>
            {/* Product Image */}
            <div className='space-y-4'>
              <div className='aspect-w-1 aspect-h-1 w-full'>
                <img
                  src={product.main_image_url}
                  alt={product.title}
                  className='w-full h-full object-cover rounded-lg'
                />
              </div>
            </div>

            {/* Product Info */}
            <div className='space-y-6'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>{product.title}</h1>
                <p className='text-2xl font-semibold text-blue-600'>${product.price.toFixed(2)}</p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Description</h3>
                <p className='text-gray-600 leading-relaxed'>{product.description}</p>
              </div>

              {product.categories && product.categories.length > 0 && (
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>Categories</h3>
                  <div className='flex flex-wrap gap-2'>
                    {product.categories
                      .filter((cat) => cat && cat !== 'Uncategorized')
                      .map((category, index) => (
                        <span key={index} className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm'>
                          {category}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Cantidad y stock */}
              <div className='mb-2 flex items-center gap-2'>
                <span className='text-gray-700'>Cantidad:</span>
                <select
                  className='border border-gray-300 rounded px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={!canAdd}
                >
                  {Array.from({ length: Math.min(availableStock, 10) }, (_, i) => i + 1).map((val) => (
                    <option key={val} value={val}>
                      {val} unidad{val > 1 ? 'es' : ''}
                    </option>
                  ))}
                </select>
                <span className='text-xs text-gray-500'>
                  {availableStock > 0 ? `(+${availableStock} disponibles)` : '(Sin stock)'}
                </span>
              </div>

              {/* Botones CTA */}
              <div className='flex flex-col gap-2'>
                <button
                  onClick={handleBuyNow}
                  disabled={!canAdd}
                  className={`w-full py-3 rounded-lg font-semibold text-white text-lg transition-colors ${
                    canAdd ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Comprar ahora
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!canAdd}
                  className={`w-full py-3 rounded-lg font-semibold text-blue-600 bg-blue-50 border border-blue-200 text-lg transition-colors ${
                    canAdd ? 'hover:bg-blue-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
