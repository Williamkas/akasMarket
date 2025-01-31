import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { cartSchema } from "@/lib/validation/schemas";
import { getAuthenticatedUser } from "@/lib/supabase/userAuth";

export async function POST(request: Request) {
  const authResult = await getAuthenticatedUser(request);
  const { error: authError, details: authDetails, status, user } = authResult;

  if (authError) {
    return NextResponse.json(
      { error: authError, details: authDetails },
      { status: status }
    );
  }

  const body = await request.json();

  // Validación de los datos del carrito
  const validation = cartSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid cart data", details: validation.error.errors },
      { status: 400 }
    );
  }

  const { items } = validation.data;

  try {
    // Crear el carrito
    const { data: cartData, error: cartError } = await supabase
      .from("carts")
      .insert([{ user_id: user.id }])
      .select()
      .single();

    if (cartError) {
      console.error("Error creating cart:", cartError.message);
      return NextResponse.json(
        { error: "Error creating cart" },
        { status: 500 }
      );
    }

    // Crear los ítems del carrito
    const cartItems = items.map((item) => ({
      cart_id: cartData.id,
      product_id: item.productId,
      quantity: item.quantity,
    }));

    const { error: cartItemsError } = await supabase
      .from("cart_items")
      .insert(cartItems);

    if (cartItemsError) {
      console.error("Error creating cart items:", cartItemsError.message);
      return NextResponse.json(
        { error: "Error creating cart items", details: cartItemsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(cartData, { status: 201 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
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
