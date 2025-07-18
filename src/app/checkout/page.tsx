'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useEffect } from 'react';
import { toast } from 'sonner';
import HeaderCSR from '../components/HeaderCSR';
import { useSearchParams } from 'next/navigation';
import { useProductStore } from '@/store/useProductStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuth();
  const { items, hydrated: cartHydrated } = useCartStore();
  const searchParams = useSearchParams();
  const buyNow = searchParams.get('buyNow');
  const buyNowId = searchParams.get('id');
  const buyNowQty = Number(searchParams.get('qty'));
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      toast.error('Debes iniciar sesión para continuar');
      router.push('/cart');
      return;
    }

    if (cartHydrated && items.length === 0) {
      toast.error('Tu carrito está vacío');
      router.push('/products');
      return;
    }
  }, [hydrated, isAuthenticated, cartHydrated, items.length, router]);

  // Si es buyNow y no hay productos, fetch solo una vez
  useEffect(() => {
    if (buyNow && buyNowId && products.length === 0) {
      fetchProducts();
    }
  }, [buyNow, buyNowId, products.length, fetchProducts]);

  let productsToShow = items;
  if (buyNow && buyNowId && buyNowQty) {
    const product = products.find((p) => p.id === buyNowId);
    if (product) {
      productsToShow = [{ product, quantity: buyNowQty }];
    } else {
      productsToShow = [];
    }
  }

  if (!hydrated || !cartHydrated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (productsToShow.length === 0) {
    return null; // Will redirect
  }

  const total = productsToShow.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className='min-h-screen bg-gray-100'>
      <HeaderCSR />
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <button
          onClick={() => router.back()}
          className='inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8'
        >
          <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          Volver
        </button>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-6'>Checkout</h1>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Order Summary */}
            <div>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Resumen del pedido</h2>
              <div className='space-y-3'>
                {productsToShow.map(({ product, quantity }) => (
                  <div key={product.id} className='flex justify-between items-center'>
                    <div>
                      <p className='font-medium text-gray-900'>{product.title}</p>
                      <p className='text-sm text-gray-500'>Cantidad: {quantity}</p>
                    </div>
                    <p className='font-semibold text-gray-900'>${(product.price * quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className='border-t pt-4 mt-4'>
                <div className='flex justify-between items-center'>
                  <p className='text-lg font-semibold text-gray-900'>Total</p>
                  <p className='text-2xl font-bold text-blue-600'>${total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Información de pago</h2>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <p className='text-blue-800 text-center'>🚧 Página de checkout en desarrollo 🚧</p>
                <p className='text-blue-600 text-sm text-center mt-2'>Aquí se integrará la pasarela de pagos</p>
              </div>

              <button
                onClick={() => {
                  toast.success('¡Gracias por tu compra! (Simulado)');
                  router.push('/');
                }}
                className='w-full mt-4 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors'
              >
                Completar compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
