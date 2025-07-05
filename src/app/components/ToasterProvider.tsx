'use client';

import { Toaster } from 'sonner';

export default function ToasterProvider() {
  return (
    <Toaster
      position='bottom-center'
      duration={4000}
      toastOptions={{
        className: 'text-sm font-medium mx-2 sm:mx-0 w-[calc(100%-1rem)] sm:w-auto',
        style: {
          background: '#10b981',
          color: 'white',
          borderRadius: '8px',
          border: 'none',
          padding: '12px 16px'
        }
      }}
    />
  );
}
