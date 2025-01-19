import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../lib/supabase/client";
import { loginSchema } from "../../../../lib/validation/schemas";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ error: "Invalid data", details: validation.error.errors });
  }

  const { email, password } = validation.data;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user: data.user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
