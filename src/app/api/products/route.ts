import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { productsSchema, productCreateSchema } from '@/lib/validation/schemas';
import { handleError } from '@/utils/apiHelpers';
import { ProductQueryParams, ProductListResponse } from '@/types/product';
import { getAuthenticatedAdminUser } from '@/lib/supabase/userAuth';

/**
 * ✅ Endpoint para obtener una lista paginada de productos.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // 📌 Validación de los parámetros de consulta
  const validation = productsSchema.safeParse({
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    search: searchParams.get('search'),
    sortBy: searchParams.get('sortBy'),
    order: searchParams.get('order')
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
      if (error.code === 'PGRST103') {
        return NextResponse.json({ message: 'No more products available in this range.' }, { status: 400 });
      }
      return handleError(500, 'Error fetching products', error.message);
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          data: [],
          count: 0,
          page,
          limit,
          totalPages: 0,
          message: 'No products available.'
        },
        { status: 200 }
      );
    }

    const response: ProductListResponse = {
      data,
      page,
      limit,
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    };

    return NextResponse.json(response, { status: 200 });
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
    if (!validation.success) {
      return handleError(400, 'Invalid product data', validation.error.errors);
    }

    const { data, error } = await supabase.from('products').insert([validation.data]).select();

    if (error || !data) {
      return handleError(500, 'Error creating product', error?.message);
    }

    return NextResponse.json({ message: 'Product created successfully', data }, { status: 201 });
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
