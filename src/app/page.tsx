import Link from 'next/link';
import { getAllProducts } from '../services/productsService';
import Image from 'next/image';
import HeaderSSR from './components/HeaderSSR';

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
      <HeaderSSR />
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
              <div className='absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity duration-200 flex flex-col py-2 z-30'>
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
          </div>
        </div>
      )}
      <div className='min-h-screen bg-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Banner principal */}
          <section
            className='mb-8 relative w-full flex flex-col items-center justify-center text-center'
            style={{ height: 400 }}
          >
            <Image
              src='/file.svg'
              alt='Akas Market Banner'
              fill
              className='object-cover w-full h-full absolute top-0 left-0 z-0 opacity-20'
              style={{ minHeight: 400 }}
            />
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
                  className='min-w-[280px] max-w-xs bg-white rounded-lg shadow p-4 hover:shadow-lg transition flex flex-col'
                >
                  <Image
                    src={product.main_image_url || '/file.svg'}
                    alt={product.title}
                    width={400}
                    height={192}
                    className='w-full h-48 object-cover rounded mb-2'
                  />
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
    </>
  );
}
