import { NextResponse } from 'next/server';

type ErrorResponse = {
  error: string;
  details?: string;
};

/**
 * ✅ Maneja errores y devuelve una respuesta JSON con el código de estado adecuado.
 * @param status Código de estado HTTP (por defecto 500).
 * @param message Mensaje de error principal.
 * @param details Detalles adicionales del error (opcional).
 * @returns NextResponse con el error formateado.
 */
export function handleError(status: number = 500, message: string, details?: unknown): NextResponse<ErrorResponse> {
  console.error(`Error ${status}:`, message, details);

  // 🔹 Mapeo de mensajes personalizados según código de error
  const statusMessages: Record<number, string> = {
    401: 'Unauthorized access',
    403: 'Forbidden access'
  };

  // 🔹 Serialización segura de `details`
  let safeDetails: string | undefined;

  if (details instanceof Error) {
    safeDetails = details.message;
  } else if (typeof details === 'string') {
    safeDetails = details;
  } else {
    try {
      safeDetails = JSON.stringify(details);
    } catch {
      safeDetails = 'Error details could not be serialized';
    }
  }

  // 🔹 Evita enviar `{}` como `details`
  if (safeDetails === '{}') {
    safeDetails = undefined;
  }

  return NextResponse.json(
    {
      error: statusMessages[status] || message,
      details: safeDetails
    },
    { status }
  );
}
