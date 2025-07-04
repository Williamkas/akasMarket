'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function CartToast() {
  const [toast, setToast] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handler = (e: Event) => {
      if (pathname === '/cart') return;
      const custom = e as CustomEvent;
      setToast(`Agregado al carrito: ${custom.detail.name}`);
      setTimeout(() => setToast(null), 2500);
    };
    window.addEventListener('cart-toast', handler);
    return () => window.removeEventListener('cart-toast', handler);
  }, [pathname]);

  if (!toast) return null;
  return (
    <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in'>
      {toast}
    </div>
  );
}
