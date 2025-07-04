'use client';

import React from 'react';
import CustomDropdown from '@/app/components/CustomDropdown';

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
  label?: string;
}

const sortOptions: SortOption[] = [
  { value: 'title-asc', label: 'Nombre (A-Z)', sortBy: 'title', order: 'asc' },
  { value: 'title-desc', label: 'Nombre (Z-A)', sortBy: 'title', order: 'desc' },
  { value: 'price-asc', label: 'Precio (menor a mayor)', sortBy: 'price', order: 'asc' },
  { value: 'price-desc', label: 'Precio (mayor a menor)', sortBy: 'price', order: 'desc' },
  { value: 'created_at-desc', label: 'Más nuevos primero', sortBy: 'created_at', order: 'desc' },
  { value: 'created_at-asc', label: 'Más antiguos primero', sortBy: 'created_at', order: 'asc' }
];

const ProductSortOptions: React.FC<ProductSortOptionsProps> = ({
  onSortChange,
  currentSort = 'title',
  currentOrder = 'asc',
  label
}) => {
  return (
    <div className='flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200'>
      <div className='flex items-center space-x-2'>
        <span className='text-gray-700 font-medium'>{label || 'Ordenar por:'}</span>
      </div>

      <div className='relative w-48'>
        <CustomDropdown
          options={sortOptions}
          value={sortOptions.find((o) => o.sortBy === currentSort && o.order === currentOrder) || sortOptions[0]}
          onChange={(opt) => onSortChange(opt.sortBy, opt.order)}
          renderOption={(opt) => opt.label}
          getKey={(opt) => opt.value}
        />
      </div>
    </div>
  );
};

export default ProductSortOptions;
