import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../lib/supabase/client";

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Logout user
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res
        .status(500)
        .json({ error: "An error occurred while logging out." });
    }

    return res.status(200).json({ message: "Successfully logged out!" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
