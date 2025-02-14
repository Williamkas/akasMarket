'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPasswordSchema } from '@/lib/validation/schemas';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 📌 Validación con Zod
    const validation = resetPasswordSchema.safeParse({ password, token });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      // Fetch al backend para cambiar la contraseña
      const response = await fetch('/api/auth/createForgottenPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error updating password');
      }

      setError(null);
      setTimeout(() => router.push('/login'), 2000); // Redirige tras éxito
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <h2 className='text-2xl font-bold mb-4'>Reset Your Password</h2>

      {error && <p className='text-red-500'>{error}</p>}
      {!error && !loading && token && <p className='text-green-500'>Password updated! Redirecting...</p>}

      {!error && token && (
        <form onSubmit={handleSubmit} className='w-full max-w-md space-y-4'>
          <input
            type='password'
            className='w-full px-4 py-2 border rounded-md'
            placeholder='New Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400'
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}
