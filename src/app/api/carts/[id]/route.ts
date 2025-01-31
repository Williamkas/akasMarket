import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { cartIdSchema } from "@/lib/validation/schemas";
import { getAuthenticatedUser } from "@/lib/supabase/userAuth";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  // 📌 Validación del ID del carrito
  const validation = cartIdSchema.safeParse(id);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid cart ID", details: validation.error.errors },
      { status: 400 }
    );
  }

  // 📌 Obtener el usuario autenticado
  const authResult = await getAuthenticatedUser(request);
  const { error: authError, details: authDetails, status, user } = authResult;

  if (authError) {
    return NextResponse.json(
      { error: authError, details: authDetails },
      { status: status }
    );
  }

  try {
    // 📌 Consulta inicial para obtener el carrito y los items relacionados al usuario autenticado
    const { data: cartData, error: cartError } = await supabase
      .from("carts")
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
      .eq("id", id)
      .eq("user_id", user.id) // Asegura que el carrito pertenece al usuario autenticado
      .single();

    if (cartError) {
      console.error("Error fetching cart:", cartError.message);
      return NextResponse.json(
        { error: "Error fetching cart", details: cartError.message },
        { status: 500 }
      );
    }

    if (!cartData) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    // 📌 Transformar los datos del usuario
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.metadata?.name || "",
      lastname: user.metadata?.lastname || "",
    };

    // 📌 Calcular la cantidad total de productos y el precio total
    const totalQuantity = cartData.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalPrice = cartData.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    const response = {
      id: cartData.id,
      created_at: cartData.created_at,
      user: userResponse,
      items: cartData.items,
      totalQuantity,
      totalPrice,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("Internal Server Error:", err.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}

/*
Ejemplo de respuesta:
{
  "id": "cart_id",
  "created_at": "2023-10-01T00:00:00.000Z",
  "user": {
    "id": "user_id",
    "email": "john.doe@example.com",
    "name": "John",
    "lastname": "Doe"
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
