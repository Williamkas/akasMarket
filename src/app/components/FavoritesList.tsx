import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useProductStore } from '../../store/useProductStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface FavoritesListProps {
  showRemoveToast?: boolean;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ showRemoveToast = true }) => {
  const { favorites, removeFavorite } = useFavoritesStore();
  const { products } = useProductStore();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const router = useRouter();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className='text-center py-12'>
        <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
          />
        </svg>
        <h3 className='mt-2 text-sm font-medium text-gray-900'>No tienes favoritos</h3>
        <p className='mt-1 text-sm text-gray-500'>Comienza agregando productos a tus favoritos.</p>
        <div className='mt-6'>
          <Link
            href='/products'
            className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  const handleRemove = (productId: string) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeFavorite(productId);
      setRemovingId(null);
      if (showRemoveToast) {
        toast('Listo, lo eliminaste de Mis favoritos.', {
          style: { background: '#222', color: 'white' },
          duration: 4000
        });
      }
    }, 400); // Duration of the animation
  };

  return (
    <ul className='space-y-4'>
      {favoriteProducts.map((product) => (
        <li
          key={product.id}
          className={`flex items-center bg-white rounded-lg shadow p-4 transition-all duration-400 relative overflow-hidden ${
            removingId === product.id ? 'translate-x-32 opacity-0' : 'opacity-100'
          }`}
        >
          <button
            aria-label='Eliminar de favoritos'
            className='absolute right-4 top-4 text-red-500 hover:text-red-700 z-10'
            onClick={() => handleRemove(product.id)}
            disabled={removingId === product.id}
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
          <button
            className='flex items-center gap-4 flex-1 min-w-0 text-left focus:outline-none'
            onClick={() => router.push(`/products/${product.id}`)}
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <Image
              src={product.main_image_url || '/file.svg'}
              alt={product.title || 'Producto favorito'}
              width={80}
              height={80}
              className='w-20 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer'
            />
            <div className='min-w-0 pr-10'>
              <h3 className='text-lg font-semibold text-gray-900 truncate cursor-pointer overflow-hidden'>
                {product.title}
              </h3>
              <p className='text-blue-700 font-bold mt-1 mb-2'>${product.price?.toFixed(2)}</p>
              {/* Categorías eliminadas para simplificar la card */}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FavoritesList;
