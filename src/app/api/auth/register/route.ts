import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { registerSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const body = await request.json();
  const validation = registerSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid data", details: validation.error.errors },
      { status: 400 }
    );
  }

  const { email, password, name, lastname } = validation.data;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, lastname, role: "user" }, // Asignar el rol automáticamente
      },
    });

    if (error) {
      // Se verifica si el error indica que el usuario ya existe:
      if (error.message.includes("already registered")) {
        return NextResponse.json(
          { error: "User already exists." },
          { status: 400 }
        );
      }
      console.error("Error in Supabase:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "User registered successfully", user: data.user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
