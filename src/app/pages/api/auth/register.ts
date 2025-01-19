import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../lib/supabase/client";
import { registerSchema } from "../../../../lib/validation/schemas";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ error: "Invalid data", details: validation.error.errors });
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

    if (error) throw error;

    res
      .status(201)
      .json({ message: "User registered successfully", user: data.user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
