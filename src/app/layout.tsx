import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';
import CartToast from './components/CartToast';
import ToasterProvider from './components/ToasterProvider';
import StoreHydration from './components/StoreHydration';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Akas Market - Your Trusted Marketplace',
  description: 'Discover amazing deals and premium products for your home and lifestyle'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900 min-h-screen flex flex-col`}
      >
        <StoreHydration />
        <CartToast />
        <Suspense fallback='Loading...'>
          <main className='flex-1'>{children}</main>
          <Footer />
          <ToasterProvider />
        </Suspense>
      </body>
    </html>
  );
}
