import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { cartIdSchema, cartSchema } from '@/lib/validation/schemas';
import { getAuthenticatedUser } from '@/lib/supabase/userAuth';
import { handleError, handleSuccess } from '@/utils/apiHelpers';
import { CartData, CartItemInput } from '@/types/cart';
import { User, UserMetadata } from '@/types/user';

/**
 * ✅ Endpoint para recuperar un carrito por su ID.
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

    // 📌 Validar ID del carrito
    const validation = cartIdSchema.safeParse(id);
    if (!validation.success) {
      return handleError(400, 'Invalid cart ID', validation.error.errors);
    }

    // 📌 Obtener el usuario autenticado
    const authResult = await getAuthenticatedUser(request);
    if (authResult.error) {
      return handleError(authResult.status, authResult.message);
    }

    const { user } = authResult;

    // 📌 Consulta inicial para obtener el carrito y los items relacionados al usuario autenticado
    const { data: cartData, error: cartError } = await supabase
      .from('carts')
      .select(
        `
        id,
        created_at,
        user_id,
        items:cart_items (
          id,
          quantity,
          product:products (
            id,
            name,
            description,
            price,
            stock
          )
        )
      `
      )
      .eq('id', id)
      .eq('user_id', user.id) // Asegura que el carrito pertenece al usuario autenticado
      .single<CartData>();

    if (cartError) {
      return handleError(500, 'Error fetching cart', cartError);
    }

    if (!cartData) {
      return handleError(404, 'Cart not found');
    }

    // 📌 Calcular la cantidad total de productos y el precio total
    const totalQuantity = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartData.items.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);

    const userMetadata: UserMetadata = user.metadata ?? {};

    // 📌 Transformar los datos del usuario
    const userResponse: User = {
      id: user.id,
      email: user.email,
      metadata: {
        name: userMetadata.name || '',
        lastname: userMetadata.lastname || ''
      }
    };

    const response = {
      id: cartData.id,
      created_at: cartData.created_at,
      user: userResponse,
      items: cartData.items,
      totalQuantity,
      totalPrice
    };

    return handleSuccess(200, 'Cart retrieved successfully', response);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}

/**
 * ✅ Endpoint para actualizar un carrito existente.
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

    // 📌 Validar ID del carrito
    const idValidation = cartIdSchema.safeParse(id);
    if (!idValidation.success) {
      return handleError(400, 'Invalid cart ID', idValidation.error.errors);
    }

    // 📌 Validar usuario autenticado
    const authResult = await getAuthenticatedUser(request);
    if (authResult.error) {
      return handleError(authResult.status, authResult.message);
    }

    const { user } = authResult;

    // 📌 Validar los datos del carrito
    const body = await request.json();
    const validation = cartSchema.safeParse(body);
    if (!validation.success) {
      return handleError(400, 'Invalid cart data', validation.error.errors);
    }

    const { items }: { items: CartItemInput[] } = validation.data;

    // 📌 Verificar que el carrito pertenezca al usuario
    const { data: cartData, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single<CartData>();

    if (cartError || !cartData) {
      return handleError(404, 'Cart not found or unauthorized access.');
    }

    // 📌 Actualizar los ítems del carrito
    const cartItems = items.map((item: CartItemInput) => ({
      cart_id: cartData.id,
      product_id: item.productId,
      quantity: item.quantity
    }));

    const { error: updateError } = await supabase.from('cart_items').upsert(cartItems);
    if (updateError) {
      return handleError(500, 'Error updating cart items', updateError);
    }

    const response = {
      cartId: cartData.id,
      items: cartItems
    };

    return handleSuccess(200, 'Cart updated successfully', response);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}

/*
Ejemplo de respuesta del GET:
{
  "id": "cart_id",
  "created_at": "2023-10-01T00:00:00.000Z",
  "user": {
    "id": "user_id",
    "email": "john.doe@example.com",
    "metadata": {
        "name": "John",
        "lastname": "Doe"
      }
  },
  "items": [
    {
      "id": "cart_item_id",
      "quantity": 2,
      "product": {
        "id": "product_id",
        "name": "Product Name",
        "description": "Product Description",
        "price": 19.99,
        "stock": 100
      }
    }
  ],
  "totalQuantity": 2,
  "totalPrice": 39.98
}

*/
