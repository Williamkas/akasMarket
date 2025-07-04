'use client';

import React from 'react';

interface ProductSearchBarProps {
  value: string;
  onChange: (search: string) => void;
  placeholder?: string;
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ value, onChange, placeholder = 'Buscar...' }) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className='relative'>
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className='w-full pl-4 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500'
      />

      <div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1'>
        {/* Clear button */}
        {value && (
          <button
            onClick={handleClear}
            className='text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors'
            title='Clear search'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        )}

        {/* Search button */}
        <button className='bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors' title='Search'>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductSearchBar;
