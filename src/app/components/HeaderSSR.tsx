import Link from 'next/link';
import CartIconSSR from './CartIconSSR';
import LogoAkas from './LogoAkas';

const HeaderSSR = () => (
  <header className='bg-blue-700 py-4'>
    <div className='max-w-7xl mx-auto px-4'>
      {/* Desktop Layout */}
      <div className='hidden md:flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Link href='/' className='flex items-center gap-2'>
            <span className='flex items-center justify-center' style={{ width: 40, height: 40 }}>
              <LogoAkas width={100} height={100} />
            </span>
            <span className='text-white text-2xl font-bold cursor-pointer'>Akas</span>
          </Link>
        </div>
        <form action='/products' method='GET' className='flex-1 max-w-xl mx-8 relative'>
          <input
            type='text'
            name='search'
            placeholder='Buscar productos...'
            className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10'
          />
          <button type='submit' className='absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <circle cx='11' cy='11' r='8' strokeWidth='2' />
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-3.5-3.5' />
            </svg>
          </button>
        </form>
        <div className='flex items-center gap-4'>
          <Link href='/profile' className='bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold'>
            Mi cuenta
          </Link>
          <CartIconSSR />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='md:hidden space-y-3'>
        {/* Top row: Logo, Cart, Profile */}
        <div className='flex items-center justify-between'>
          <Link href='/' className='flex items-center gap-2'>
            <span className='flex items-center justify-center' style={{ width: 32, height: 32 }}>
              <LogoAkas width={28} height={28} />
            </span>
            <span className='text-white text-xl font-bold cursor-pointer'>Akas</span>
          </Link>
          <div className='flex items-center gap-3'>
            <Link href='/profile' className='text-white hover:text-gray-200 transition-colors'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            </Link>
            <CartIconSSR />
          </div>
        </div>

        {/* Bottom row: Search */}
        <form action='/products' method='GET' className='relative'>
          <input
            type='text'
            name='search'
            placeholder='Buscar productos...'
            className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10'
          />
          <button type='submit' className='absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <circle cx='11' cy='11' r='8' strokeWidth='2' />
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-3.5-3.5' />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </header>
);

export default HeaderSSR;
