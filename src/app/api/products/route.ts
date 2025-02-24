import { supabase } from '@/lib/supabase/client';
import { productsSchema, productCreateSchema } from '@/lib/validation/schemas';
import { handleError, handleSuccess } from '@/utils/apiHelpers';
import { ProductQueryParams } from '@/types/product';
import { getAuthenticatedAdminUser } from '@/lib/supabase/userAuth';

/**
 * ✅ Endpoint para obtener una lista paginada de productos.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // 📌 Validación de los parámetros de consulta
  const validation = productsSchema.safeParse({
    page: searchParams.get('page') ?? '1',
    limit: searchParams.get('limit') ?? '10',
    search: searchParams.get('search') ?? '',
    sortBy: searchParams.get('sortBy') ?? 'name',
    order: searchParams.get('order') ?? 'asc'
  });

  if (!validation.success) {
    return handleError(400, 'Invalid query parameters', validation.error.errors);
  }

  const { page, limit, search, sortBy, order }: ProductQueryParams = validation.data;

  // 📌 Se calcula el rango de datos para la paginación
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // 📌 Consulta a la tabla `products` con el rango y orden especificados
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' }) // Selección de todos los campos y contar resultados
      .order(sortBy, { ascending: order === 'asc' })
      .range(from, to);

    // 📌 Aplicar búsqueda si hay un término
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      const errorMessage =
        error.code === 'PGRST103' ? 'No more products available in this range.' : 'Error fetching products';
      return handleError(400, errorMessage, error.message, error.code);
    }

    const response = {
      data: data ?? [],
      page,
      limit,
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    };

    return handleSuccess(
      200,
      data.length > 0 ? 'Product list retrieved successfully' : 'No products available',
      response
    );
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}

/**
 * ✅ Endpoint para crear un nuevo producto.
 *    Solo un administrador puede crear productos.
 */
export async function POST(request: Request) {
  try {
    // 📌 Validar usuario autenticado y rol de admin
    const authResult = await getAuthenticatedAdminUser(request);
    if (authResult.error) {
      return handleError(authResult.status, authResult.message);
    }

    const body = await request.json();

    // 📌 Validar los datos del producto
    const validation = productCreateSchema.safeParse(body);
    if (!validation.success) return handleError(400, 'Invalid product data', validation.error.errors);

    const { images, categories, ...productData } = validation.data;

    // 📌 Si se pasan categorías, asegurarse de que sean un array de strings
    if (categories && (!Array.isArray(categories) || categories.some((cat) => typeof cat !== 'string'))) {
      return handleError(400, 'Invalid categories format');
    }

    // Insertar producto
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([{ ...productData, main_image_url: images[0], categories }])
      .select()
      .single();

    if (productError || !product) return handleError(500, 'Error creating product', productError);

    // Insertar imágenes
    const imageRecords = images.map((url: string, index: number) => ({
      product_id: product.id,
      image_url: url,
      is_primary: index === 0
    }));

    const { error: imagesError } = await supabase.from('product_images').insert(imageRecords);
    if (imagesError) return handleError(500, 'Error saving product images', imagesError);

    return handleSuccess(201, 'Product created successfully', product);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
