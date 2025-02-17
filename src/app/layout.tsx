import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback='Loading...'>
          <Header />
          {children}
          <Footer />
          <Toaster
            position='bottom-center' // Cambiar la posición del toast
            duration={4000} // Duración en milisegundos (4 segundos en este caso)
            toastOptions={{
              className: 'text-lg font-bold', // Aquí se ajusta el tamaño del texto y otras clases
              style: {
                background: 'green', // Puedes personalizar los colores aquí si lo deseas
                color: 'white',
                borderRadius: '8px'
              }
            }}
          />
        </Suspense>
      </body>
    </html>
  );
}
