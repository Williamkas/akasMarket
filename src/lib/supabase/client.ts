import { createClient } from "@supabase/supabase-js";

// URL y clave anónima desde las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Creación del cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Error al conectar con Supabase:", error.message);
      return false;
    }

    console.log("Conexión exitosa. Datos:", data);
    return true;
  } catch (err) {
    console.error("Error inesperado:", err);
    return false;
  }
};
