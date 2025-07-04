'use client';
import React, { useState, useEffect } from 'react';
import { useProductStore } from '../../store/useProductStore';

interface ProductFiltersProps {
  categories: string[];
  label?: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ categories, label }) => {
  const { filters, setFiltersAndSearch, fetchProducts } = useProductStore();
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filters.categories || []);
  const [isExpanded, setIsExpanded] = useState(false);

  // Solo sincroniza los estados locales cuando el store cambia (no dispara fetch ni setFilters aquí)
  useEffect(() => {
    setMinPrice(filters.minPrice || '');
    setMaxPrice(filters.maxPrice || '');
    setSelectedCategories(filters.categories || []);
  }, [filters.minPrice, filters.maxPrice, filters.categories]);

  // Handlers reactivos
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'minPrice') {
      setMinPrice(value);
      setFiltersAndSearch({ minPrice: value ? Number(value) : undefined, page: 1 });
      fetchProducts();
    }
    if (name === 'maxPrice') {
      setMaxPrice(value);
      setFiltersAndSearch({ maxPrice: value ? Number(value) : undefined, page: 1 });
      fetchProducts();
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let updated: string[];
    if (checked) {
      updated = [...selectedCategories, value];
    } else {
      updated = selectedCategories.filter((cat) => cat !== value);
    }
    setSelectedCategories(updated);
    setFiltersAndSearch({ categories: updated, page: 1 });
    fetchProducts();
  };

  // Quitar filtro individual
  const removeCategory = (cat: string) => {
    const updated = selectedCategories.filter((c) => c !== cat);
    setSelectedCategories(updated);
    setFiltersAndSearch({ categories: updated, page: 1 });
    fetchProducts();
  };
  const removeMinPrice = () => {
    setMinPrice('');
    setFiltersAndSearch({ minPrice: undefined, page: 1 });
    fetchProducts();
  };
  const removeMaxPrice = () => {
    setMaxPrice('');
    setFiltersAndSearch({ maxPrice: undefined, page: 1 });
    fetchProducts();
  };

  // Borrar todos los filtros
  const clearAll = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategories([]);
    setFiltersAndSearch({ minPrice: undefined, maxPrice: undefined, categories: [], page: 1 });
    fetchProducts();
  };

  // Mostrar tags de filtros activos
  const hasActiveFilters =
    (minPrice && minPrice !== '') || (maxPrice && maxPrice !== '') || selectedCategories.length > 0;

  let priceTag = '';
  if (minPrice && maxPrice) priceTag = `Precio: $${minPrice} - $${maxPrice}`;
  else if (minPrice) priceTag = `Precio: $${minPrice}min`;
  else if (maxPrice) priceTag = `Precio: $${maxPrice}max`;

  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
      {/* Header con chevron para mobile */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors md:hidden'
      >
        <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
          <svg className='w-5 h-5 mr-2 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
            />
          </svg>
          {label ? label : 'Filtros'}
        </h3>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {/* Desktop header */}
      <div className='hidden md:block p-4 border-b border-gray-200'>
        <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
          <svg className='w-5 h-5 mr-2 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
            />
          </svg>
          {label ? label : 'Filtros'}
        </h3>
      </div>

      {/* Contenido de filtros */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block p-4 space-y-6`}>
        {/* Filtros activos */}
        {hasActiveFilters && (
          <div className='pt-4 border-t border-gray-200 mb-4'>
            <h5 className='text-sm font-medium text-gray-900 mb-2'>Filtros activos:</h5>
            <div className='flex flex-wrap gap-2 mb-2'>
              {priceTag && (
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                  {priceTag}
                  <button
                    onClick={minPrice ? removeMinPrice : removeMaxPrice}
                    className='ml-1 text-blue-600 hover:text-blue-800'
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                >
                  {cat}
                  <button onClick={() => removeCategory(cat)} className='ml-1 text-blue-600 hover:text-blue-800'>
                    ×
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={clearAll}
              className='w-full text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded-md py-2 hover:bg-blue-50 transition-colors'
            >
              Borrar filtros
            </button>
          </div>
        )}

        {/* Price Range */}
        <div className='space-y-3'>
          <h4 className='font-semibold text-gray-900'>Precio</h4>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-sm text-gray-600 mb-1'>Min ($)</label>
              <input
                type='number'
                name='minPrice'
                value={minPrice}
                onChange={handlePriceChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                min='0'
                placeholder='Min'
              />
            </div>
            <div>
              <label className='block text-sm text-gray-600 mb-1'>Max ($)</label>
              <input
                type='number'
                name='maxPrice'
                value={maxPrice}
                onChange={handlePriceChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                min='0'
                placeholder='Max'
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className='space-y-3'>
          <h4 className='font-semibold text-gray-900'>Categorías</h4>
          <div className='space-y-2 max-h-64 overflow-y-auto'>
            {categories.map((category) => (
              <label
                key={category}
                className='flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors'
              >
                <input
                  type='checkbox'
                  name='categories'
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={handleCategoryChange}
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <span className='text-gray-700 text-sm'>{category}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
