import { supabase } from '@/lib/supabase/client';
import { productIdSchema } from '@/lib/validation/schemas';
import { handleError, handleSuccess } from '@/utils/apiHelpers';

export async function getProductDetails(id: string) {
  try {
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
