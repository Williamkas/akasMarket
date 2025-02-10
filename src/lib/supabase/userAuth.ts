import { supabase } from './client';

/**
 * ✅ Valida y obtiene al usuario autenticado desde Supabase.
 */
export async function getAuthenticatedUser(request: Request): Promise<
  | { error: true; status: number; message: string } // Caso de error
  | { error: false; user: { id: string; email: string; metadata: Record<string, unknown>; createdAt: string } } // Caso de éxito
> {
  // 📌 Extraer el token del header "Authorization".
  const authHeader = request.headers.get('Authorization');
  const token = authHeader ? authHeader.split(' ')[1] : null;

  // 📌 Si no hay token, devolver un error.
  if (!token) {
    return {
      error: true,
      status: 401,
      message: 'Auth session missing!'
    };
  }

  // 📌 Obtener al usuario autenticado desde Supabase.
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser(token);

  // 📌 Si hay un error al obtener al usuario, devolver el error.
  if (authError) {
    return {
      error: true,
      status: 500,
      message: authError.message || 'Error fetching user'
    };
  }

  // 📌 Si no se encuentra al usuario, devolver un error.
  if (!user) {
    return {
      error: true,
      status: 401,
      message: 'No user is authenticated.'
    };
  }

  // 📌 Llamar a la función RPC para obtener los datos del usuario desde la base de datos.
  const { data: userData, error: rpcError } = await supabase.rpc('get_user_by_email', { email: user.email });

  // 📌 Si hay un error al ejecutar la función RPC o no se obtienen datos, devolver un error.
  if (rpcError || !userData) {
    return {
      error: true,
      status: 500,
      message: rpcError?.message || 'Error fetching user data'
    };
  }

  // 📌 Validamos que metadata tenga un rol y forzamos su tipo
  const metadata = userData.user_metadata as Record<string, unknown>;
  if (typeof metadata.role !== 'string') {
    return { error: true, message: 'User role is missing or invalid.', status: 500 };
  }

  // 📌 Formatear los datos del usuario obtenidos.
  const formattedUser = {
    id: userData.id,
    email: userData.email,
    metadata: { ...metadata, role: metadata.role },
    createdAt: userData.created_at
  };

  // 📌 Devolver el usuario formateado si todo salió bien.
  return { error: false, user: formattedUser };
}

/**
 * ✅ Valida que el usuario esté autenticado y tenga rol de administrador.
 */
export async function getAuthenticatedAdminUser(request: Request): Promise<
  | { error: true; status: number; message: string } // Caso de error
  | {
      error: false;
      user: { id: string; email: string; metadata: { role: string }; createdAt: string; [key: string]: unknown };
    } // Caso de éxito
> {
  // 📌 Validar que el usuario esté autenticado utilizando `getAuthenticatedUser`.
  const authResult = await getAuthenticatedUser(request);

  // 📌 Si hubo un error al autenticar al usuario, devolver el error.
  if (authResult.error) {
    return {
      error: true,
      status: authResult.status,
      message: authResult.message // Este mensaje siempre está disponible.
    };
  }

  // 📌 Extraer al usuario del resultado exitoso.
  const { user } = authResult;

  // 📌 Validar que el usuario tenga rol de administrador.
  if (user?.metadata?.role !== 'admin') {
    return {
      error: true,
      status: 403,
      message: 'Unauthorized access. Admin role required.'
    };
  }

  // 📌 Devolver el usuario si está autenticado y tiene rol de administrador.
  return { error: false, user: { ...user, metadata: { ...user.metadata, role: user.metadata.role as string } } };
}
