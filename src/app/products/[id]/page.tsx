import { getProductDetails } from '@/services/productService';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const response = await getProductDetails(id);
  const result = await response.json();

  if (!result?.success || !result.data) {
    return notFound();
  }

  const product = result.data;

  return (
    <div className='max-w-3xl mx-auto py-10 px-4'>
      <div className='flex flex-col md:flex-row gap-8'>
        {/* Imagen principal */}
        <div className='flex-shrink-0 w-full md:w-1/2'>
          <Image
            src={product.main_image_url || '/placeholder-product.jpg'}
            alt={product.title}
            width={400}
            height={400}
            className='rounded-lg object-cover w-full h-80'
            priority
          />
        </div>
        {/* Info producto */}
        <div className='flex-1'>
          <h1 className='text-3xl font-bold mb-2'>{product.title}</h1>
          <p className='text-gray-600 mb-4'>{product.description}</p>
          <div className='mb-4'>
            <span className='text-2xl font-bold text-blue-700'>${product.price?.toFixed(2)}</span>
            {product.stock !== undefined && <span className='ml-4 text-sm text-gray-500'>Stock: {product.stock}</span>}
          </div>
          {product.categories && product.categories.length > 0 && (
            <div className='mb-4'>
              <span className='font-semibold text-gray-700'>Categories: </span>
              {product.categories.map((cat: string) => (
                <span key={cat} className='inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs mr-2'>
                  {cat}
                </span>
              ))}
            </div>
          )}
          {/* Aquí puedes agregar más detalles, botones, etc. */}
        </div>
      </div>
    </div>
  );
}
