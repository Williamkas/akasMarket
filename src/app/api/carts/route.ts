import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { cartSchema } from '@/lib/validation/schemas';
import { getAuthenticatedUser } from '@/lib/supabase/userAuth';
import { handleError } from '@/utils/errorHandler';
import { CreateCartRequest, CreatedCartResponse } from '@/types/cart';

/**
 * ✅ Endpoint para crear un nuevo carrito.
 */
export async function POST(request: Request) {
  try {
    // 📌 Validar usuario autenticado
    const authResult = await getAuthenticatedUser(request);
    if (authResult.error) {
      return handleError(authResult.status, authResult.message);
    }

    const { user } = authResult;
    const body: CreateCartRequest = await request.json();

    // 📌 Validar los datos del carrito
    const validation = cartSchema.safeParse(body);
    if (!validation.success) {
      return handleError(400, 'Invalid cart data', validation.error.errors);
    }

    const { items } = validation.data;

    // 📌 Crear el carrito
    const { data: cartData, error: cartError } = await supabase
      .from('carts')
      .insert([{ user_id: user.id }])
      .select()
      .single();

    if (cartError || !cartData) {
      return handleError(500, 'Error creating cart', cartError);
    }

    // 📌 Crear los ítems del carrito
    const cartItems = items.map((item) => ({
      cart_id: cartData.id,
      product_id: item.productId,
      quantity: item.quantity
    }));

    const { error: cartItemsError } = await supabase.from('cart_items').insert(cartItems);
    if (cartItemsError) {
      return handleError(500, 'Error creating cart items', cartItemsError);
    }

    // 📌 Respuesta tipada
    const response: CreatedCartResponse = cartData;
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}

/*
REQUEST:
POST http://localhost:3000/api/carts
content-type: application/json

{
  "userId": "0ee91776-e8f4-4045-9cad-f212f710f1c5",
  "items": [
    {
      "productId": "20f03f4d-bd15-4dae-a40f-4634d35b6bff",
      "quantity": 2
    }
  ]
}

-----------------------------------------------------------------

RESPONSE:
{
  "id": "188aa541-1dff-4fb8-922a-7002674243e1",
  "user_id": "0ee91776-e8f4-4045-9cad-f212f710f1c5",
  "created_at": "2025-01-31T21:02:31.22295"
}
*/
