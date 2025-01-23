import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { productsSchema } from "@/lib/validation/schemas";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Validación de datos
  const validation = productsSchema.safeParse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: validation.error.errors },
      { status: 400 }
    );
  }

  const { page, limit } = validation.data;

  // Se calcula el rango de datos basado en la paginación:
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // Consulta a la tabla `products` con el rango calculado
    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" }) // Seleccionar todo y contar los resultados totales
      .range(from, to);

    if (error) {
      if (error.code === "PGRST103") {
        return NextResponse.json(
          { message: "No more products available in this range." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Error fetching products" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          data: [],
          count: 0,
          page,
          limit,
          totalPages: 0,
          message: "No products available.",
        },
        { status: 200 }
      );
    }

    const totalPages = Math.ceil(count || 0 / limit);

    return NextResponse.json(
      {
        data,
        page,
        limit,
        count, // Total de productos disponibles
        totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
