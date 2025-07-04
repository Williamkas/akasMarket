'use client';

import React, { useState, useEffect } from 'react';

interface PriceRange {
  min?: number;
  max?: number;
}

interface ProductFiltersProps {
  onFiltersChange: (filters: { priceRange?: PriceRange; categories?: string[] }) => void;
  categories: string[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFiltersChange, categories }) => {
  const [priceRange, setPriceRange] = useState<PriceRange>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  // Solo enviar priceRange si hay algún valor
  useEffect(() => {
    onFiltersChange({
      priceRange: priceRange.min !== undefined || priceRange.max !== undefined ? priceRange : undefined,
      categories: selectedCategories
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange, selectedCategories]);

  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    const newRange = { ...priceRange, [field]: numValue };
    setPriceRange(newRange);
  };

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
  };

  const clearAllFilters = () => {
    setPriceRange({});
    setSelectedCategories([]);
  };

  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
      {/* Header */}
      <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
            <svg className='w-5 h-5 mr-2 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
              />
            </svg>
            Filters
          </h3>
          <button onClick={() => setIsExpanded(!isExpanded)} className='text-gray-500 hover:text-gray-700 lg:hidden'>
            <svg
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters Content */}
      <div className={`${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className='p-4 space-y-6'>
          {/* Clear Filters Button */}
          {(selectedCategories.length > 0 || priceRange.min !== undefined || priceRange.max !== undefined) && (
            <button
              onClick={clearAllFilters}
              className='w-full text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded-md py-2 hover:bg-blue-50 transition-colors'
            >
              Clear All Filters
            </button>
          )}

          {/* Price Range */}
          <div className='space-y-3'>
            <h4 className='font-semibold text-gray-900'>Price Range</h4>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>Min ($)</label>
                <input
                  type='number'
                  value={priceRange.min === undefined ? '' : priceRange.min}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                  min='0'
                  placeholder='Min'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>Max ($)</label>
                <input
                  type='number'
                  value={priceRange.max === undefined ? '' : priceRange.max}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                  min='0'
                  placeholder='Max'
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className='space-y-3'>
            <h4 className='font-semibold text-gray-900'>Categories</h4>
            <div className='space-y-2 max-h-64 overflow-y-auto'>
              {categories.map((category) => (
                <label
                  key={category}
                  className='flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors'
                >
                  <input
                    type='checkbox'
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <span className='text-gray-700 text-sm'>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {(selectedCategories.length > 0 || priceRange.min !== undefined || priceRange.max !== undefined) && (
            <div className='pt-4 border-t border-gray-200'>
              <h5 className='text-sm font-medium text-gray-900 mb-2'>Active Filters:</h5>
              <div className='space-y-2'>
                {(priceRange.min !== undefined || priceRange.max !== undefined) && (
                  <div className='text-sm text-gray-600'>
                    Price: ${priceRange.min ?? '-'} - ${priceRange.max ?? '-'}
                  </div>
                )}
                {selectedCategories.length > 0 && (
                  <div className='flex flex-wrap gap-1'>
                    {selectedCategories.map((category) => (
                      <span
                        key={category}
                        className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                      >
                        {category}
                        <button
                          onClick={() => handleCategoryToggle(category)}
                          className='ml-1 text-blue-600 hover:text-blue-800'
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
