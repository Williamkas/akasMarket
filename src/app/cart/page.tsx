'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import QuantitySelector from '../components/QuantitySelector';
import Breadcrumb from '../components/Breadcrumb';
import { useAuth, useAuthStore } from '@/store/useAuthStore';
import AuthModal from '../components/AuthModal';
import { toast } from 'sonner';

const CartPage: React.FC = () => {
  const router = useRouter();
  const { items, addToCart, removeFromCart, deleteFromCart, hydrated } = useCartStore();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { setRedirectUrl, clearRedirectUrl } = useAuthStore();
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Cambiar cantidad: setea la cantidad exacta
  const handleQuantityChange = (productId: string, newQty: number, currentQty: number) => {
    if (newQty > currentQty) {
      for (let i = 0; i < newQty - currentQty; i++) addToCart(items.find((i) => i.product.id === productId)!.product);
    } else if (newQty < currentQty) {
      for (let i = 0; i < currentQty - newQty; i++) removeFromCart(productId);
    }
  };

  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    if (isAuthenticated) {
      // Redirigir a la pasarela de pago
      toast.success('Redirigiendo a la pasarela de pago...');
      router.push('/checkout');
    } else {
      // Store current path for redirect after login
      setRedirectUrl('/cart');
      setShowAuthModal(true);
    }
  };

  // Don't render until hydrated to prevent hydration mismatch
  if (!hydrated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-3xl mx-auto px-4 py-8'>
        <Breadcrumb />
        {/* Botón Volver sobre fondo gris general, sin div extra */}
        <button
          onClick={() => router.back()}
          className='inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8'
        >
          <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          Volver
        </button>

        {/* Lista de productos */}
        {items.length === 0 ? (
          <div className='bg-white p-8 rounded-lg shadow text-center text-gray-500'>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>Mi Carrito</h1>
            Tu carrito está vacío.
            <div className='mt-4'>
              <Link href='/products' className='text-blue-600 hover:underline'>
                Ver productos
              </Link>
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>Mi Carrito</h1>
            <ul className='divide-y divide-gray-200'>
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className={`py-4 transition-all duration-400 relative overflow-hidden ${
                    removingId === product.id ? 'translate-x-32 opacity-0' : 'opacity-100'
                  }`}
                >
                  <div className='flex flex-col sm:flex-row gap-4'>
                    {/* Product Image - Clickable */}
                    <Link href={`/products/${product.id}`} className='flex-shrink-0'>
                      <Image
                        src={product.main_image_url || '/file.svg'}
                        alt={product.title}
                        width={80}
                        height={80}
                        className='w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity'
                      />
                    </Link>

                    {/* Product Info - Clickable */}
                    <div className='flex-1 min-w-0'>
                      <Link href={`/products/${product.id}`} className='block'>
                        <h2 className='font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer'>
                          {product.title}
                        </h2>
                      </Link>
                      <p className='text-gray-500 text-sm'>${product.price.toFixed(2)} c/u</p>

                      {/* Mobile: Stack quantity controls vertically */}
                      <div className='mt-2 sm:hidden'>
                        <div className='flex flex-col gap-2'>
                          <div className='flex items-center gap-2'>
                            <span className='text-gray-700 text-sm'>Cantidad:</span>
                            <QuantitySelector
                              value={quantity}
                              onChange={(val) => handleQuantityChange(product.id, val, quantity)}
                              min={1}
                              max={product.stock}
                            />
                          </div>
                          <span className='text-xs text-gray-500'>
                            {product.stock > 0 ? `(+${product.stock} disponibles)` : '(Sin stock)'}
                          </span>
                        </div>
                      </div>

                      {/* Desktop: Keep horizontal layout */}
                      <div className='hidden sm:flex items-center gap-2 mt-2'>
                        <span className='text-gray-700 text-sm'>Cantidad:</span>
                        <QuantitySelector
                          value={quantity}
                          onChange={(val) => handleQuantityChange(product.id, val, quantity)}
                          min={1}
                          max={product.stock}
                        />
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className='flex flex-col items-end gap-2'>
                      <span className='font-semibold text-gray-900'>${(product.price * quantity).toFixed(2)}</span>
                      <button
                        onClick={() => {
                          setRemovingId(product.id);
                          setTimeout(() => {
                            deleteFromCart(product.id);
                            setRemovingId(null);
                            toast('Listo! Eliminaste el producto.', {
                              style: { background: '#22c55e', color: 'white' },
                              duration: 5000
                            });
                          }, 400);
                        }}
                        className='text-red-500 hover:underline text-xs'
                        disabled={removingId === product.id}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Resumen */}
        {items.length > 0 && (
          <div className='bg-white rounded-lg shadow-sm p-6 flex flex-col items-end'>
            <div className='mb-2 text-gray-700'>
              Total ({totalCount} producto{totalCount !== 1 ? 's' : ''}):
            </div>
            <div className='text-2xl font-bold text-blue-600 mb-4'>${total.toFixed(2)}</div>
            <button
              onClick={handleCheckout}
              className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
            >
              Finalizar compra
            </button>
          </div>
        )}

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            clearRedirectUrl();
          }}
          onSuccess={() => {
            setShowAuthModal(false);
            // Aquí podrías redirigir a un gateway de pago
            toast.success('¡Redirigiendo al pago...');
            clearRedirectUrl();
          }}
          title='Finalizar compra'
          description='Necesitamos que inicies sesión para continuar con la compra.'
        />
      </div>
    </div>
  );
};

export default CartPage;
