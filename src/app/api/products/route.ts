import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { productsSchema } from '@/lib/validation/schemas';
import { handleError } from '@/utils/errorHandler';
import { ProductQueryParams, ProductListResponse } from '@/types/product';

/**
 * ✅ Endpoint para obtener una lista paginada de productos.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // 📌 Validar parámetros de consulta
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

    // 📌 Calcular el rango de datos basado en la paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order(sortBy, { ascending: order === 'asc' })
      .range(from, to);

    // 📌 Aplicar búsqueda si hay un término
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return handleError(500, 'Error fetching products', error);
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

    const { data, error } = await supabase.from('products').insert([validation.data]);

    if (error) {
      return handleError(500, 'Error creating product', error);
    }

    return NextResponse.json({ message: 'Product created successfully', data }, { status: 201 });
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
