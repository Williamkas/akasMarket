'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryParams = useSearchParams();
  const hasWelcomeParam = queryParams.has('welcome');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al iniciar sesión');
      }
      // TODO: Acá deberíamos guardar el token en una cookie y que luego podamos leer en los fetch para el carrito o post, patch, delete de productos.
      toast.success('✅ Inicio de sesión exitoso');

      setTimeout(() => {
        // TODO: Redirigir a la página del Carrito de compra si venía de ahí. Leer algún parametro de la URL para saber si venía de ahí.
        router.push('/');
      }, 1000);
    } catch (error) {
      toast.error(`❌ ${error instanceof Error ? error.message : 'Error al iniciar sesión'}`);
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='flex flex-col items-center text-center max-w-lg'>
        {hasWelcomeParam && (
          <>
            <h1 className='text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
              ✅ Bienvenido a <span className='text-blue-600'>Akas Market!</span>
            </h1>
            <p className='text-lg text-gray-600 leading-relaxed mt-6 mb-8'>
              Ahora inicia sesión para seguir navegando o buscando el producto que necesitas!
            </p>
          </>
        )}
        <div className='w-full max-w-md min-w-[400px] bg-white p-8 rounded-xl shadow-lg'>
          <h2 className='text-2xl font-bold text-center text-gray-700 mb-6'>Iniciar sesión</h2>
          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className='block text-gray-600 text-left font-medium'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Ingresa tu email'
                required
              />
            </div>

            <div>
              <label className='block text-gray-600 text-left font-medium'>Contraseña</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Ingresa tu contraseña'
                required
              />
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300'
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

            <p className='text-sm text-gray-500 text-center mt-4'>
              ¿No tienes una cuenta?{' '}
              <a href='/auth/register' className='text-blue-600 hover:underline'>
                Regístrate
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
