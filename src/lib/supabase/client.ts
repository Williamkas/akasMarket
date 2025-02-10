import { createClient } from '@supabase/supabase-js';

// URL y clave anónima desde las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Creación del cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
