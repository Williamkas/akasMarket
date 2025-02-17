'use client';

import { useRouter } from 'next/navigation';

const WelcomePage = () => {
  const router = useRouter();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6'>
      <div className='bg-white shadow-lg rounded-xl p-8 max-w-lg text-center'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
          ✅ Bienvenido a <span className='text-blue-600'>Akas Marker!</span>
        </h1>
        <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
          Ahora inicia sesión para seguir navegando o buscando el producto que necesitas.
        </p>
        <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
          ¡Explora nuestras opciones y encuentra lo que más te gusta!
        </p>
        <button
          className='px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300'
          onClick={() => router.push('/auth/login')}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
