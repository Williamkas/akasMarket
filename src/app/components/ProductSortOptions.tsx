'use client';

import React from 'react';
import { useProductStore } from '../../store/useProductStore';
import CustomDropdown from './CustomDropdown';

type SortOption = { label: string; value: { sortBy: string; order: 'asc' | 'desc' } };

const SORT_OPTIONS: SortOption[] = [
  { label: 'Más relevantes', value: { sortBy: 'created_at', order: 'desc' } },
  { label: 'Menor precio', value: { sortBy: 'price', order: 'asc' } },
  { label: 'Mayor precio', value: { sortBy: 'price', order: 'desc' } },
  { label: 'Nombre (A-Z)', value: { sortBy: 'title', order: 'asc' } },
  { label: 'Nombre (Z-A)', value: { sortBy: 'title', order: 'desc' } }
];

const ProductSortOptions: React.FC<{ label?: string }> = ({ label }) => {
  const { filters, setFiltersAndSearch, fetchProducts } = useProductStore();
  const current: SortOption =
    SORT_OPTIONS.find((opt) => opt.value.sortBy === filters.sortBy && opt.value.order === filters.order) ||
    SORT_OPTIONS[0];

  const handleChange = (option: SortOption) => {
    setFiltersAndSearch({ sortBy: option.value.sortBy, order: option.value.order, page: 1 });
    fetchProducts();
  };

  return (
    <div className='bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-2'>
      <span className='text-gray-700 font-medium mb-1'>{label || 'Ordenar por:'}</span>
      <CustomDropdown
        options={SORT_OPTIONS}
        value={current}
        onChange={handleChange}
        renderOption={(opt) => opt.label}
        getKey={(opt) => opt.label}
      />
    </div>
  );
};

export default ProductSortOptions;
