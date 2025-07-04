'use client';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className='flex items-center text-black hover:text-gray-700 mb-6 font-medium text-base'
    >
      <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
      </svg>
      Volver
    </button>
  );
};

export default BackButton;
