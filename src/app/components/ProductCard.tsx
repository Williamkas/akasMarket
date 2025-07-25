import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { useFavoritesStore } from '../../store/useFavoritesStore';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  status: 'new' | 'old';
  delivery_type: 'Envío a domicilio' | 'Retiro en sucursal';
  onFavorite: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, imageUrl, status, delivery_type, onFavorite }) => {
  const [hovered, setHovered] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const favorite = isFavorite(id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorite) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
    onFavorite(id);
  };

  return (
    <Link
      href={`/products/${id}`}
      className='block border rounded-lg shadow-md p-4 group transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className='relative'>
        <div className='w-full aspect-square rounded-md overflow-hidden bg-gray-100'>
          <Image
            src={imageUrl || '/file.svg'}
            alt={title}
            fill
            className='w-full h-full object-cover rounded-md'
            style={{ aspectRatio: '1/1' }}
          />
        </div>
        {/* Icono de favorito solo en hover */}
        <button
          type='button'
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 bg-white rounded-full p-1 shadow transition-opacity duration-200 ${
            hovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label='Agregar a favoritos'
        >
          <svg className='w-6 h-6' fill={favorite ? 'black' : 'none'} stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z'
            />
          </svg>
        </button>
      </div>
      <h2 className='text-lg font-semibold text-black mt-2'>{title}</h2>
      {/* Precio destacado arriba de los tags */}
      <p className='text-blue-700 font-bold text-xl mt-2 mb-1'>${price.toFixed(2)}</p>
      {/* Tags de características */}
      <div className='flex flex-wrap gap-2 mb-2'>
        <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium'>
          {status === 'new' ? 'Nuevo' : 'Usado'}
        </span>
        <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium'>{delivery_type}</span>
      </div>
    </Link>
  );
};

export default ProductCard;
