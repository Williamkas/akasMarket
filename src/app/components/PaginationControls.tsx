'use client';

import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount?: number;
  itemsPerPage?: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalCount = 0,
  itemsPerPage = 10
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 4) {
        // Near the beginning
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4'>
      <div className='flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0'>
        {/* Results info */}
        <div className='text-sm text-gray-700'>
          {totalCount > 0 && (
            <>
              Showing <span className='font-medium'>{startItem}</span> to <span className='font-medium'>{endItem}</span>{' '}
              of <span className='font-medium'>{totalCount}</span> results
            </>
          )}
        </div>

        {/* Pagination controls */}
        <div className='flex items-center space-x-2'>
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            Previous
          </button>

          {/* Page numbers */}
          <div className='hidden sm:flex items-center space-x-1'>
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className='px-3 py-2 text-sm text-gray-500'>...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border border-blue-600'
                        : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile page indicator */}
          <div className='sm:hidden flex items-center space-x-2'>
            <span className='text-sm text-gray-700'>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Next
            <svg className='w-4 h-4 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick page jump (optional) */}
      {totalPages > 10 && (
        <div className='mt-4 pt-4 border-t border-gray-200 flex items-center justify-center space-x-2'>
          <span className='text-sm text-gray-600'>Go to page:</span>
          <input
            type='number'
            min='1'
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }}
            className='w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
          <span className='text-sm text-gray-600'>of {totalPages}</span>
        </div>
      )}
    </div>
  );
};

export default PaginationControls;
