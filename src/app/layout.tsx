import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';

import ToasterProvider from './components/ToasterProvider';
import StoreHydration from './components/StoreHydration';
import AuthHydration from './components/AuthHydration';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Akas Market',
  description: 'Your trusted marketplace for quality products'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToasterProvider />
        <AuthHydration />
        <div className='flex flex-col min-h-screen'>
          {/* <Header /> */}
          <main className='flex-1'>
            <Suspense fallback={<div>Loading...</div>}>
              <StoreHydration />
              {children}
            </Suspense>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
