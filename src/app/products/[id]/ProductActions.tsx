'use client';
import React from 'react';
import type { Product } from '@/services/productsService';

interface ProductActionsProps {
  product: Product;
}

const ProductActions: React.FC<ProductActionsProps> = ({}) => {
  return (
    <div className='mt-8 flex flex-col gap-3'>
      <button
        className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors'
        onClick={() => {
          /* TODO: Comprar */
        }}
      >
        Comprar
      </button>
      <button
        className='w-full bg-white border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors'
        onClick={() => {
          /* TODO: Agregar al carrito */
        }}
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductActions;
