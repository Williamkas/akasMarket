import { supabase } from "./client";

export async function getAuthenticatedUser(request: Request) {
  // 📌 Extraer el token del header
  const authHeader = request.headers.get("Authorization");
  const token = authHeader ? authHeader.split(" ")[1] : null;

  if (!token) {
    return {
      error: "Auth session missing!",
      status: 401,
    };
  }

  // 📌 Se obtiene el usuario autenticado con el token
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError) {
    return {
      error: "Error fetching user",
      details: authError.message,
      status: 500,
    };
  }

  if (!user) {
    return { error: "No user is authenticated.", status: 401 };
  }

  // 📌 Llamada a la función RPC `get_user_by_email` dado que la tabla `auth.users` no es pública
  const { data: userData, error: rpcError } = await supabase.rpc(
    "get_user_by_email",
    { email: user.email }
  );

  if (rpcError || !userData) {
    return {
      error: "Error fetching user data",
      details: rpcError?.message,
      status: 500,
    };
  }

  // 📌 Se transforman los datos
  const formattedUser = {
    id: userData.id,
    email: userData.email,
    metadata: userData.user_metadata,
    createdAt: userData.created_at,
  };

  return { user: formattedUser, status: 200 };
}
