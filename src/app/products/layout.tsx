'use client';

import HeaderCSR from '../components/HeaderCSR';

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-gray-100'>
      <HeaderCSR />
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>{children}</main>
    </div>
  );
}
