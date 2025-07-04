'use client';

import Link from 'next/link';
import { useCartStore } from '../../store/useCartStore';
import { useState, useEffect } from 'react';

const CartIcon = () => {
  const cartCount = useCartStore((state) => state.getCartCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link href='/cart' className='relative group'>
      {/* Icono de carrito estilo MercadoLibre */}
      <svg
        className='w-7 h-7 text-white group-hover:text-gray-200 transition-colors'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
        />
      </svg>

      {/* Contador de elementos */}
      {mounted && cartCount > 0 && (
        <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg'>
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
