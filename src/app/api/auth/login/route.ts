import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const body = await request.json();
  const validation = loginSchema.safeParse(body);
  
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid data", details: validation.error.errors },
      { status: 400 }
    );
  }
  
  const { email, password } = validation.data;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Response from Supabase:", { data, error });
    
    if (error) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 } // 401 porque aquí el problema es de autenticación
      );
    }

    return NextResponse.json(
      { message: "Login successful", user: data.user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
