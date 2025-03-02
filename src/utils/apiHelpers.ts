import { NextResponse } from 'next/server';
import { ErrorResponse, SuccessResponse } from '@/types/api';

/**
 * ✅ Maneja errores y devuelve una respuesta JSON con el código de estado adecuado.
 * @param status Código de estado HTTP (por defecto 500).
 * @param message Mensaje de error principal.
 * @param details Detalles adicionales del error (opcional).
 * @param code Código de error interno (opcional).
 * @returns NextResponse con el error formateado.
 */
export function handleError(
  status: number = 500,
  message: string,
  details?: unknown,
  code?: string
): NextResponse<ErrorResponse> {
  console.error(`Error ${status}:`, message, details);

  // 🔹 Serialización segura de `details`
  let safeDetails: string | undefined;

  if (details instanceof Error) {
    safeDetails = details.message;
  } else if (Array.isArray(details)) {
    // Si `details` es un arreglo, mapeamos para mostrar los mensajes de error
    safeDetails = details
      .map((error: Record<string, unknown>) => `Path: ${error.validation}, message: ${error.message}`)
      .join(', ');
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
      success: false,
      error: {
        message: message,
        code,
        details: safeDetails
      },
      data: null
    },
    { status }
  );
}

/**
 * ✅ Maneja respuestas exitosas y devuelve una respuesta JSON formateada.
 * @param status Código de estado HTTP (por defecto 200).
 * @param message Mensaje de éxito.
 * @param data Datos de la respuesta.
 * @param headers Cabeceras personalizadas (opcional).
 * @returns NextResponse con el resultado formateado.
 */
export function handleSuccess<T>(
  status: number = 200,
  message: string,
  data: T,
  headers?: HeadersInit
): NextResponse<SuccessResponse<T>> {
  const response = NextResponse.json<SuccessResponse<T>>({ success: true, message, data }, { status });

  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}
