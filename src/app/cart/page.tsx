'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import CustomDropdown from '../components/CustomDropdown';
import Image from 'next/image';

const CartPage: React.FC = () => {
  const router = useRouter();
  const { items, addToCart, removeFromCart, deleteFromCart, hydrated } = useCartStore();

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

  // Don't render until hydrated to prevent hydration mismatch
  if (!hydrated) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-3xl mx-auto px-4 py-8'>
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
        {/* Encabezado */}
        <div className='flex items-center mb-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Mi Carrito</h1>
        </div>

        {/* Lista de productos */}
        {items.length === 0 ? (
          <div className='bg-white p-8 rounded-lg shadow text-center text-gray-500'>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>Mi Carrito</h1>
            Tu carrito está vacío.
            <div className='mt-4'>
              <Link href='/' className='text-blue-600 hover:underline'>
                Ver productos
              </Link>
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>Mi Carrito</h1>
            <ul className='divide-y divide-gray-200'>
              {items.map(({ product, quantity }) => (
                <li key={product.id} className='flex items-center py-4 gap-4'>
                  <Image
                    src={product.main_image_url || '/file.svg'}
                    alt={product.title}
                    width={80}
                    height={80}
                    className='w-20 h-20 object-cover rounded'
                  />
                  <div className='flex-1'>
                    <h2 className='font-semibold text-gray-900'>{product.title}</h2>
                    <p className='text-gray-500 text-sm'>${product.price.toFixed(2)} c/u</p>
                    <div className='flex items-center gap-2 mt-2'>
                      <span className='text-gray-700 text-sm'>Cantidad:</span>
                      <CustomDropdown
                        options={Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1)}
                        value={quantity}
                        onChange={(val) => handleQuantityChange(product.id, val, quantity)}
                        renderOption={(val) => `${val} unidad${val > 1 ? 'es' : ''}`}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col items-end'>
                    <span className='font-semibold text-gray-900'>${(product.price * quantity).toFixed(2)}</span>
                    <button
                      onClick={() => deleteFromCart(product.id)}
                      className='mt-2 text-red-500 hover:underline text-xs'
                    >
                      Quitar
                    </button>
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
            <button className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
              Finalizar compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
