import Link from 'next/link';
import { getAllProducts } from '../services/productsService';
import Image from 'next/image';
import HeaderWrapper from './components/HeaderWrapper';
import ResetPasswordHandler from './components/ResetPasswordHandler';
import AuthModalTrigger from './components/AuthModalTrigger';

export default async function Home() {
  // Fetch productos recientes
  const recentRes = await getAllProducts({ sortBy: 'created_at', order: 'desc', limit: 6 });
  const recentProducts = Array.isArray(recentRes.data) ? recentRes.data : [];

  // Obtener categorías destacadas de los productos recientes
  const categorySet = new Set<string>();
  recentProducts.forEach((p) => {
    if (Array.isArray(p.categories)) {
      p.categories.forEach((cat) => {
        if (cat && cat !== 'Uncategorized') categorySet.add(cat);
      });
    }
  });
  const featuredCategories = Array.from(categorySet).slice(0, 6);

  return (
    <>
      <HeaderWrapper />
      {/* Fila de categorías tipo abanico */}
      {featuredCategories.length > 0 && (
        <div className='relative z-20 bg-white shadow-sm border-b flex items-center h-10'>
          <div className='max-w-7xl mx-auto w-full flex items-center h-full px-4 sm:px-6 lg:px-8'>
            <div className='group relative h-full flex items-center'>
              <button className='text-blue-700 font-semibold text-lg h-full flex items-center px-3 hover:bg-blue-50 rounded transition'>
                Categorías
                <svg className='w-4 h-4 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </button>
              <div className='absolute left-0 top-full w-48 bg-white rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity duration-200 flex flex-col py-2 z-30'>
                {featuredCategories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?categories=${encodeURIComponent(cat)}`}
                    className='px-4 py-2 hover:bg-blue-50 text-blue-700 text-base font-medium rounded transition'
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href='/products'
              className='ml-4 text-blue-700 font-semibold text-lg h-full flex items-center px-3 hover:bg-blue-50 rounded transition'
            >
              Productos
            </Link>
          </div>
        </div>
      )}
      <div className='min-h-screen bg-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Banner principal */}
          <section
            className='mb-8 relative w-full flex flex-col items-center justify-center text-center bg-blue-100 px-4 sm:px-6 lg:px-8'
            style={{ height: 300 }}
          >
            <div className='relative z-10 flex flex-col items-center justify-center h-full w-full'>
              <h1 className='text-4xl font-bold text-blue-700 mb-2'>Bienvenido a Akas Market</h1>
              <p className='text-lg text-gray-700 mb-4'>
                Descubre productos increíbles y las mejores ofertas para tu hogar y estilo de vida.
              </p>
            </div>
          </section>

          {/* Productos recientes */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Novedades</h2>
            <div className='flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-200'>
              {recentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className='min-w-[280px] w-[280px] bg-white rounded-lg shadow p-4 hover:shadow-lg transition flex flex-col'
                >
                  <div className='aspect-square w-full mb-2'>
                    <Image
                      src={product.main_image_url || '/file.svg'}
                      alt={product.title}
                      width={280}
                      height={280}
                      className='w-full h-full object-cover rounded'
                    />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900'>{product.title}</h3>
                  <p className='text-blue-700 font-bold mt-1 mb-2'>${product.price.toFixed(2)}</p>
                  <div className='flex flex-wrap gap-2'>
                    {product.categories?.map((cat) => (
                      <span key={cat} className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
                        {cat}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Client component para manejar tokens de reset de contraseña */}
      <ResetPasswordHandler />
      {/* Client component para abrir modal de reset de contraseña */}
      <AuthModalTrigger />
      {/* Debug component */}
      {/* <DebugAuth /> */}
    </>
  );
}
