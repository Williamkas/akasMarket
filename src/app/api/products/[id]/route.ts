import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { productIdSchema, productCreateSchema } from '@/lib/validation/schemas';
import { getAuthenticatedAdminUser } from '@/lib/supabase/userAuth';
import { handleError } from '@/utils/errorHandler';
import { Product, ProductUpdateRequest } from '@/types/product';

/**
 * ✅ Endpoint para obtener un producto por su ID.
 */
export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    // 📌 Validar ID del producto
    const validation = productIdSchema.safeParse(id);
    if (!validation.success) {
      return handleError(400, 'Invalid product ID', validation.error.errors);
    }

    const { data, error } = await supabase.from('products').select('*').eq('id', id).single<Product>();

    if (error) {
      return handleError(500, 'Error fetching product', error);
    }

    if (!data) {
      return handleError(404, 'Product not found');
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}

/**
 * ✅ Endpoint para actualizar un producto existente.
 */
export async function PATCH(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    // 📌 Validar ID del producto
    const idValidation = productIdSchema.safeParse(id);
    if (!idValidation.success) {
      return handleError(400, 'Invalid product ID', idValidation.error.errors);
    }

    // 📌 Validar usuario autenticado y rol de admin
    const authResult = await getAuthenticatedAdminUser(request);
    if (authResult.error) {
      return handleError(authResult.status, authResult.message);
    }

    const body = await request.json();

    // 📌 Validar los datos del producto (parcialmente)
    const validation = productCreateSchema.partial().safeParse(body);
    if (!validation.success) {
      return handleError(400, 'Invalid product data', validation.error.errors);
    }

    const { data, error } = await supabase
      .from('products')
      .update(validation.data as ProductUpdateRequest)
      .eq('id', id);

    if (error) {
      return handleError(500, 'Error updating product', error);
    }

    return NextResponse.json({ message: 'Product updated successfully', data }, { status: 200 });
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
