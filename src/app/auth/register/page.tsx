'use client';

import { useState } from 'react';
import { registerSchema } from '@/lib/validation/frontendSchemas';
import { toast } from 'sonner';
import HeaderSSR from '../../components/HeaderSSR';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar los datos con Zod
    const result = registerSchema.safeParse({ email, password, confirmPassword, name, lastname });

    if (!result.success) {
      // Si hay errores de validación, mostramos el primer error encontrado con sonner
      result.error.errors.forEach((err) => toast.error(err.message));
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name, lastname })
      });
      const data = await response.json();

      if (!response.ok) {
        // 🔴 Si el servidor devuelve error, mostrar `data.error.message` y `data.error.details`
        const errorMessage = data?.error?.message || 'Registration failed';

        // Manejar errores específicos con mensajes más amigables
        if (errorMessage === 'Email already registered') {
          throw new Error(
            'Este correo electrónico ya está registrado. Por favor, usa otro correo o inicia sesión si ya tienes una cuenta.'
          );
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

        const errorDetails = data?.error?.details ? ` (${data.error.details})` : '';
        throw new Error(errorMessage + errorDetails);
      }

      // ✅ Mostrar mensaje de éxito del servicio
      toast.success(data.message);
    } catch (error) {
      // 🔴 Manejo seguro de `unknown` con TypeScript
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <HeaderSSR />
      <div className='flex items-center justify-center min-h-screen bg-gray-100 px-6'>
        <div className='bg-white shadow-lg rounded-xl p-8 max-w-md w-full'>
          <h2 className='text-2xl font-bold text-gray-800 text-center mb-6'>Regístrate</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Nombre'
              required
              className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            <input
              type='text'
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder='Apellido'
              required
              className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Correo electrónico'
              required
              className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Contraseña'
              required
              className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirmar contraseña'
              required
              className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            <button
              type='submit'
              className='w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300'
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
