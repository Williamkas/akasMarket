import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { productIdSchema, productCreateSchema } from '@/lib/validation/schemas';
import { getAuthenticatedAdminUser } from '@/lib/supabase/userAuth';
import { handleError, handleSuccess } from '@/utils/apiHelpers';

/**
 * ✅ Endpoint para obtener un producto por su ID.
 */
export async function GET(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    // 📌 Se obtiene el parámetro dinámico `id` desde la URL
    const id = pathname.split('/').at(-1);

    // 📌 Se valida si `id` está presente
    if (!id) {
      return handleError(400, 'Missing ID parameter');
    }

    // 📌 Validar ID del producto
    const validation = productIdSchema.safeParse(id);
    if (!validation.success) {
      return handleError(400, 'Invalid product ID format', validation.error.errors);
    }

    // 📌 Buscamos el producto en la base de datos.
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

    if (error) {
      return handleError(500, 'Error fetching product', error);
    }

    if (!data) {
      return handleError(404, 'Product not found');
    }

    return handleSuccess(200, 'Product retrieved successfully', data);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}

/**
 * ✅ Endpoint para actualizar un producto existente.
 */
export async function PATCH(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    // 📌 Se obtiene el parámetro dinámico `id` desde la URL
    const id = pathname.split('/').at(-1);

    // 📌 Se valida si `id` está presente
    if (!id) {
      return handleError(400, 'Missing ID parameter');
    }
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

    const { images, ...updateData } = validation.data;

    // Actualizar producto
    const { data: updatedProduct, error: productError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (productError || !updatedProduct) return handleError(500, 'Error updating product', productError);

    // Si se enviaron nuevas imágenes, se actualiza la tabla
    if (images && images.length > 0) {
      const { error: deleteImagesError } = await supabase.from('product_images').delete().eq('product_id', id);
      if (deleteImagesError) {
        return handleError(500, 'Error deleting product images', deleteImagesError);
      }

      const newImages = images.map((url, index) => ({
        product_id: id,
        image_url: url,
        is_primary: index === 0
      }));

      const { error: imagesError } = await supabase.from('product_images').insert(newImages);
      if (imagesError) {
        return handleError(500, 'Error saving product images', imagesError);
      }
    }

    return handleSuccess(200, 'Product updated successfully', updatedProduct);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}

/**
 * ✅ Endpoint para eliminar un producto.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const id = pathname.split('/').at(-1);
    if (!id) return handleError(400, 'Missing ID parameter');

    const idValidation = productIdSchema.safeParse(id);
    if (!idValidation.success) return handleError(400, 'Invalid product ID', idValidation.error.errors);

    const authResult = await getAuthenticatedAdminUser(request);
    if (authResult.error) return handleError(authResult.status, authResult.message);

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return handleError(500, 'Error deleting product', error);

    return handleSuccess(200, 'Product deleted successfully', null);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
