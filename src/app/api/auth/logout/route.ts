import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: "An error occurred while logging out." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Successfully logged out!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
