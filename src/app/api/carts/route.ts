import { supabase } from '@/lib/supabase/client';
import { NextRequest } from 'next/server';
import { createCartSchema, updateCartSchema, removeItemSchema } from '@/lib/validation/schemas';
import { getAuthenticatedUser } from '@/lib/supabase/userAuth';
import { handleError, handleSuccess } from '@/utils/apiHelpers';
import { CartData, CartItemInput, CreateCartRequest, CreatedCartResponse, CartItem } from '@/types/cart';

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
    const validation = createCartSchema.safeParse(body);
    if (!validation.success) {
      return handleError(400, 'Invalid cart data', validation.error.errors);
    }

    const { items } = validation.data;

    // 📌 Verificar si el usuario ya tiene un carrito existente para no crear otro
    const { data: existingCart, error: cartCheckError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle(); // Devuelve `null` si no hay carrito

    if (cartCheckError) {
      return handleError(500, 'Error checking existing cart', cartCheckError);
    }

    if (existingCart) {
      return handleError(400, 'User already has an existing cart');
    }

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
    return handleSuccess(201, 'Cart created successfully', response);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}

/**
 * ✅ Endpoint para recuperar un carrito asociado al id del usuario.
 */
export async function GET(request: NextRequest) {
  try {
    // 📌 Obtener el usuario autenticado
    const authResult = await getAuthenticatedUser(request);
    if (authResult.error) {
      return handleError(authResult.status, authResult.message);
    }

    const { user } = authResult;

    // 📌 Buscar el carrito del usuario autenticado
    const { data: cartData, error: cartError } = await supabase
      .from('carts')
      .select(
        `
        id,
        created_at,
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
      .eq('user_id', user.id) // 🔹 Se filtra por el usuario autenticado
      .single<CartData>();

    if (cartError) {
      return handleError(500, 'Error fetching cart', cartError);
    }

    if (!cartData) {
      return handleError(404, 'Cart not found');
    }

    // 📌 Calcular totales
    const totalQuantity = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartData.items.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);

    const response = {
      id: cartData.id,
      created_at: cartData.created_at,
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
 * ✅ Endpoint para eliminar un producto del carrito.
 */
export async function DELETE(request: NextRequest) {
  try {
    // 📌 Validar usuario autenticado
    const authResult = await getAuthenticatedUser(request);
    if (authResult.error) {
      return handleError(authResult.status, authResult.message);
    }

    const { user } = authResult;

    // 📌 Validar los datos del carrito
    const body = await request.json();
    const validation = removeItemSchema.safeParse(body);
    if (!validation.success) {
      return handleError(400, 'Invalid cart data', validation.error.errors);
    }

    const { productId }: { productId: string } = validation.data;

    // 📌 Buscar el carrito del usuario
    const { data: cartData, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id) // Usamos el user.id del token
      .single<CartData>();

    if (cartError || !cartData) {
      return handleError(404, 'Cart not found');
    }

    // 📌 Eliminar el producto del carrito
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cartData.id)
      .eq('product_id', productId);

    if (deleteError) {
      return handleError(500, 'Error deleting product from cart', deleteError);
    }

    return handleSuccess(200, 'Product removed from cart successfully', null);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}

/*
REQUEST:
POST http://localhost:3000/api/carts
content-type: application/json

{
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

/**
 * ✅ Endpoint para actualizar un carrito existente con nuevos elementos.
 */
export async function PATCH(request: NextRequest) {
  try {
    // 📌 Validar usuario autenticado
    const authResult = await getAuthenticatedUser(request);
    if (authResult.error) {
      return handleError(authResult.status, authResult.message);
    }

    const { user } = authResult;

    // 📌 Validar los datos del carrito
    const body = await request.json();
    const validation = updateCartSchema.safeParse(body);
    if (!validation.success) {
      return handleError(400, 'Invalid cart data', validation.error.errors);
    }

    const { items, updateType }: { items: CartItemInput[]; updateType: 'set' | 'increment' } = validation.data;

    if (!updateType || !['set', 'increment'].includes(updateType)) {
      return handleError(400, 'Invalid update type in the body request');
    }

    // 📌 Buscar el carrito del usuario
    const { data: cartData, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single<CartData>();

    if (cartError || !cartData) {
      return handleError(404, 'Cart not found');
    }

    // 📌 Buscar los productos actuales del carrito
    const { data: existingItems, error: itemsError } = await supabase
      .from('cart_items')
      .select('id, product_id, quantity')
      .eq('cart_id', cartData.id);

    if (itemsError) {
      return handleError(500, 'Error fetching cart items', itemsError);
    }

    // 📌 Mapear los productos existentes en un objeto para acceso rápido
    const existingItemsMap = new Map(existingItems.map((item) => [item.product_id, item]));

    // 📌 Manejar los tres casos según `updateType`
    const updatedCartItems: Array<Omit<CartItem, 'product'>> = items.map((newItem) => {
      const existingItem = existingItemsMap.get(newItem.productId);

      if (existingItem) {
        // Si el producto ya está en el carrito, sólo actualizamos la cantidad
        return {
          id: existingItem.id, // Mantiene el ID existente, necesario para que Supabase actualice en lugar de insertar
          cart_id: cartData.id,
          product_id: existingItem.product_id,
          quantity:
            updateType === 'increment'
              ? existingItem.quantity + newItem.quantity // Caso 2: Sumar si viene del detalle del producto
              : newItem.quantity // Caso 3: Setear cantidad si viene del carrito de compras, updateType === 'set'
        };
      }
      // Caso 1: El producto no existe en el carrito por lo tanto se agrega
      return {
        id: crypto.randomUUID(), // Generamos un UUID manualmente para evitar conflictos con supabase
        cart_id: cartData.id,
        product_id: newItem.productId,
        quantity: newItem.quantity
      };
    });

    // 📌 Actualizar los productos en la base de datos
    if (updatedCartItems.length > 0) {
      const { error: updateError } = await supabase
        .from('cart_items')
        .upsert(updatedCartItems, { onConflict: 'cart_id, product_id' });

      if (updateError) {
        return handleError(500, 'Error updating cart items', updateError);
      }
    }

    return handleSuccess(200, 'Cart updated successfully', {
      cartId: cartData.id,
      items: updatedCartItems
    });
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
