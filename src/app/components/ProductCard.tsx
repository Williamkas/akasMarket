import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';

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

  return (
    <Link
      href={`/products/${id}`}
      className='block border rounded-lg shadow-md p-4 group transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className='relative'>
        <Image
          src={imageUrl || '/file.svg'}
          alt={title}
          width={400}
          height={192}
          className='w-full h-48 object-cover rounded-md'
        />
        {/* Icono de favorito solo en hover */}
        <button
          type='button'
          onClick={(e) => {
            e.preventDefault();
            onFavorite(id);
          }}
          className={`absolute top-2 right-2 bg-white rounded-full p-1 shadow transition-opacity duration-200 ${
            hovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label='Agregar a favoritos'
        >
          <svg className='w-6 h-6 text-black' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z'
            />
          </svg>
        </button>
      </div>
      <h2 className='text-lg font-semibold mt-2'>{title}</h2>
      {/* Tags de características */}
      <div className='flex flex-wrap gap-2 mt-2 mb-2'>
        <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium'>
          {status === 'new' ? 'Nuevo' : 'Usado'}
        </span>
        <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium'>{delivery_type}</span>
      </div>
      <p className='text-gray-700'>${price.toFixed(2)}</p>
    </Link>
  );
};

export default ProductCard;
