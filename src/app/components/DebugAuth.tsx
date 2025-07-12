'use client';

import { useAuth, useAuthStore } from '@/store/useAuthStore';

export default function DebugAuth() {
  const { isAuthenticated, hydrated, user } = useAuth();
  const { setUser, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className='fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50'>
      <div className='mb-2'>
        <strong>Auth Debug:</strong>
      </div>
      <div>Hydrated: {hydrated ? '✅' : '❌'}</div>
      <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
      <div>User: {user ? user.email : 'None'}</div>
      <div className='mt-2 space-x-2'>
        <button onClick={handleLogout} className='bg-red-600 px-2 py-1 rounded text-xs'>
          Logout
        </button>
        <button onClick={handleRefresh} className='bg-blue-600 px-2 py-1 rounded text-xs'>
          Refresh
        </button>
      </div>
    </div>
  );
}
