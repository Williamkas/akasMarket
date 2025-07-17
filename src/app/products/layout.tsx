'use client';

import HeaderWrapper from '../components/HeaderWrapper';

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-gray-100'>
      <HeaderWrapper />
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>{children}</main>
    </div>
  );
}
