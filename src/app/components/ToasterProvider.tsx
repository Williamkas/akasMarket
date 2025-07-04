'use client';

import { Toaster } from 'sonner';

export default function ToasterProvider() {
  return (
    <Toaster
      position='bottom-center'
      duration={4000}
      toastOptions={{
        className: 'text-sm font-medium',
        style: {
          background: '#10b981',
          color: 'white',
          borderRadius: '8px',
          border: 'none'
        }
      }}
    />
  );
}
