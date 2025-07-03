'use client';

import React from 'react';

interface SortOption {
  value: string;
  label: string;
  sortBy: string;
  order: 'asc' | 'desc';
}

interface ProductSortOptionsProps {
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
  currentSort?: string;
  currentOrder?: 'asc' | 'desc';
}

const sortOptions: SortOption[] = [
  { value: 'title-asc', label: 'Name (A-Z)', sortBy: 'title', order: 'asc' },
  { value: 'title-desc', label: 'Name (Z-A)', sortBy: 'title', order: 'desc' },
  { value: 'price-asc', label: 'Price (Low to High)', sortBy: 'price', order: 'asc' },
  { value: 'price-desc', label: 'Price (High to Low)', sortBy: 'price', order: 'desc' },
  { value: 'created_at-desc', label: 'Newest First', sortBy: 'created_at', order: 'desc' },
  { value: 'created_at-asc', label: 'Oldest First', sortBy: 'created_at', order: 'asc' },
];

const ProductSortOptions: React.FC<ProductSortOptionsProps> = ({
  onSortChange,
  currentSort = 'title',
  currentOrder = 'asc'
}) => {
  const currentValue = `${currentSort}-${currentOrder}`;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = sortOptions.find(option => option.value === e.target.value);
    if (selectedOption) {
      onSortChange(selectedOption.sortBy, selectedOption.order);
    }
  };

  return (
    <div className='flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200'>
      <div className='flex items-center space-x-2'>
        <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12' />
        </svg>
        <span className='text-gray-700 font-medium'>Sort by:</span>
      </div>
      
      <div className='relative'>
        <select
          value={currentValue}
          onChange={handleSortChange}
          className='appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer'
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
          <svg className='w-4 h-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProductSortOptions;