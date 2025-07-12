'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPasswordSchema } from '@/lib/validation/schemas';
import { toast } from 'sonner';
import HeaderSSR from '../../components/HeaderSSR';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verificar si las contraseñas coinciden en tiempo real
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const isPasswordValid = password.length >= 6;

  useEffect(() => {
    if (!token) {
      setError('Enlace inválido o expirado');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

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
        const errorMessage = data?.error?.message || data?.message || 'Error al actualizar la contraseña';

        // Manejar errores específicos
        if (errorMessage.includes('Invalid or expired token')) {
          throw new Error('El enlace de recuperación ha expirado o es inválido. Solicita uno nuevo.');
        }

        // Manejar errores de validación del backend
        if (errorMessage === 'Invalid data' && data?.error?.details) {
          // Si hay detalles de validación, mostrarlos
          if (Array.isArray(data.error.details)) {
            // Si es un array de errores, mostrar el primero
            const firstError = data.error.details[0];
            if (firstError && firstError.message) {
              throw new Error(firstError.message);
            }
          } else if (typeof data.error.details === 'string') {
            // Si es un string directo
            throw new Error(data.error.details);
          }
        }

        throw new Error(errorMessage);
      }

      setSuccess(true);
      setError(null);
      toast.success('✅ Contraseña actualizada exitosamente. Redirigiendo al login...');
      setTimeout(() => router.push('/auth/login'), 3000); // Redirige tras éxito
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderSSR />
      <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
        <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-lg'>
          <div className='text-center mb-6'>
            <h1 className='text-2xl font-bold text-gray-800 mb-2'>Restablecer contraseña</h1>
            <p className='text-gray-600'>Ingresa tu nueva contraseña para completar el proceso de recuperación.</p>
          </div>

          {error && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-600 text-sm'>{error}</p>
            </div>
          )}

          {success && (
            <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
              <p className='text-green-600 text-sm'>✅ Contraseña actualizada exitosamente. Redirigiendo al login...</p>
            </div>
          )}

          {!success && token && (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Nueva contraseña</label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Ingresa tu nueva contraseña'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  >
                    {showPassword ? (
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                        />
                      </svg>
                    ) : (
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {password && (
                  <div className='mt-1 text-sm'>
                    {isPasswordValid ? (
                      <span className='text-green-600 flex items-center gap-1'>
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                        Contraseña válida
                      </span>
                    ) : (
                      <span className='text-red-600'>La contraseña debe tener al menos 6 caracteres</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Confirmar contraseña</label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Confirma tu nueva contraseña'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  >
                    {showConfirmPassword ? (
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                        />
                      </svg>
                    ) : (
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {confirmPassword && (
                  <div className='mt-1 text-sm'>
                    {passwordsMatch ? (
                      <span className='text-green-600 flex items-center gap-1'>
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                        Las contraseñas coinciden
                      </span>
                    ) : (
                      <span className='text-red-600'>Las contraseñas no coinciden</span>
                    )}
                  </div>
                )}
              </div>

              <button
                type='submit'
                className={`w-full font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                  passwordsMatch && isPasswordValid && !loading
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={loading || !passwordsMatch || !isPasswordValid}
              >
                {loading ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
            </form>
          )}

          {!token && !success && (
            <div className='text-center'>
              <p className='text-gray-600 mb-4'>El enlace de recuperación no es válido.</p>
              <a href='/auth/forgot-password' className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
                Solicitar nuevo enlace
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
