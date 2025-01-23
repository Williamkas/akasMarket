import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { productIdSchema } from "@/lib/validation/schemas";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Validación del ID con Zod
  const validation = productIdSchema.safeParse(id);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid product ID", details: validation.error.errors },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error.message);
      return NextResponse.json(
        { error: "Error fetching product" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
