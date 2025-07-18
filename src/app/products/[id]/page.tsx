'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductDetails } from '@/services/productService';
import { useCartStore } from '@/store/useCartStore';
import type { Product } from '@/services/productsService';
import { useFavoritesStore, useFavoritesHydration } from '@/store/useFavoritesStore';
import Image from 'next/image';
import CustomDropdown from '@/app/components/CustomDropdown';
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'sonner';

const BackButton = () => (
  <button
    onClick={() => window.history.back()}
    className='inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6'
  >
    <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
    </svg>
    Volver
  </button>
);

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, items, hydrated: cartHydrated } = useCartStore();
  const cartItem = items.find((item) => item.product.id === productId);
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const favorite = isFavorite(productId);

  // Handle favorites hydration
  useFavoritesHydration();

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

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(productId);
      toast('Eliminaste el producto de Mis favoritos.', {
        style: { background: '#222', color: 'white' },
        duration: 4000
      });
    } else {
      addFavorite(productId);
      toast.success(
        <span>
          Se agregó a Mis favoritos.{' '}
          <Link href='/account?tab=favorites' className='underline text-white font-semibold ml-2'>
            Ir a Mis favoritos
          </Link>
        </span>,
        {
          style: { background: '#10b981', color: 'white' },
          duration: 4000
        }
      );
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
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

  // Don't render until cart is hydrated to prevent hydration mismatch
  if (!cartHydrated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando...</p>
        </div>
      </div>
    );
  }

  // Stock máximo (si no hay stock, deshabilitar botones)
  const maxStock = typeof product.stock === 'number' ? product.stock : 10;
  const availableStock = maxStock - (cartItem?.quantity || 0);
  const canAdd = availableStock > 0;

  // Determinar si hay categorías válidas
  const validCategories = product.categories?.filter((cat) => cat && cat !== 'Uncategorized') || [];

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Breadcrumb />
        <BackButton />
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-8'>
            {/* Product Image */}
            <div className='space-y-4'>
              <div className='aspect-w-1 aspect-h-1 w-full'>
                <Image
                  src={product.main_image_url || '/file.svg'}
                  alt={product.title}
                  width={600}
                  height={600}
                  className='w-full h-full object-cover rounded-lg'
                />
              </div>
            </div>

            {/* Product Info */}
            <div className='space-y-6'>
              <div>
                {/* Fila con tag y favoritos */}
                <div className='flex items-center justify-between mb-2'>
                  <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium'>
                    {product.status === 'new' ? 'Nuevo' : 'Usado'}
                  </span>
                  <button
                    type='button'
                    className='bg-white rounded-full p-1 shadow'
                    aria-label='Agregar a favoritos'
                    onClick={handleFavoriteClick}
                  >
                    <svg
                      className='w-8 h-8'
                      fill={favorite ? 'black' : 'none'}
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z'
                      />
                    </svg>
                  </button>
                </div>
                <h1 className='text-3xl font-bold text-gray-900'>{product.title}</h1>
                <p className='text-2xl font-bold text-blue-700 mt-2'>${product.price.toFixed(2)}</p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Descripción</h3>
                <p className='text-gray-600 leading-relaxed'>{product.description}</p>
              </div>

              {validCategories.length > 0 && (
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>Categorías</h3>
                  <div className='flex flex-wrap gap-2'>
                    {validCategories.map((category, index) => (
                      <span key={index} className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm'>
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sección de Envío */}
              <div className='mt-4'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Envío:</h3>
                <span className='bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium'>
                  {product.delivery_type}
                </span>
              </div>

              {/* Cantidad y stock - Mobile: Column layout, Desktop: Row layout */}
              <div className='mb-2'>
                {/* Mobile: Column layout */}
                <div className='sm:hidden flex flex-col gap-2'>
                  <span className='text-gray-700'>Cantidad:</span>
                  <div className='w-full'>
                    <CustomDropdown
                      options={Array.from({ length: Math.min(availableStock, 6) }, (_, i) => i + 1)}
                      value={quantity}
                      onChange={setQuantity}
                      renderOption={(val) => `${val} unidad${val > 1 ? 'es' : ''}`}
                    />
                  </div>
                  <span className='text-xs text-gray-500'>
                    {availableStock > 0 ? `(+${availableStock} disponibles)` : '(Sin stock)'}
                  </span>
                </div>

                {/* Desktop: Row layout */}
                <div className='hidden sm:flex items-center gap-2'>
                  <span className='text-gray-700'>Cantidad:</span>
                  <div className='w-44'>
                    <CustomDropdown
                      options={Array.from({ length: Math.min(availableStock, 6) }, (_, i) => i + 1)}
                      value={quantity}
                      onChange={setQuantity}
                      renderOption={(val) => `${val} unidad${val > 1 ? 'es' : ''}`}
                    />
                  </div>
                  <span className='text-xs text-gray-500'>
                    {availableStock > 0 ? `(+${availableStock} disponibles)` : '(Sin stock)'}
                  </span>
                </div>
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
