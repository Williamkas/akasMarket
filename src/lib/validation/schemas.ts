import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("The email address is not valid."),
  password: z
    .string()
    .min(6, "The password must be at least 6 characters long."),
  name: z.string().min(2, "The name must be at least 2 characters long."),
  lastname: z
    .string()
    .min(2, "The last name must be at least 2 characters long."),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export const productsSchema = z.object({
  page: z
    .string()
    // Se permite que el valor sea null:
    .nullable()
    // Se transforma null en los valores predeterminados "1" y "10":
    .transform((value) => (value === null ? "1" : value))
    // Se asegura que el valor no sea null y que sea un número válido. Si la validación es false se muestra el mensaje de error:
    .refine((value) => value !== null && !isNaN(parseInt(value)), {
      message: "Page must be a number",
    })
    // Se transforma la cadena en un número entero.
    .transform((value) => (value === null ? 1 : parseInt(value))),

  limit: z
    .string()
    .nullable()
    .transform((value) => (value === null ? "10" : value))
    .refine((value) => value !== null && !isNaN(parseInt(value)), {
      message: "Limit must be a number",
    })
    .transform((value) => (value === null ? 10 : parseInt(value))),
  search: z
    .string()
    .optional()
    // Se limpian espacios:
    .transform((val) => (val ? val.trim() : "")),
  // Campo por el que ordenamos (nombre o precio)
  sortBy: z.enum(["name", "price"]).optional().default("name"),
  // Orden ascendente o descendente:
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const productIdSchema = z.string().uuid("Invalid product ID format");

// Esquema de validación para los datos del carrito
export const cartSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  items: z.array(
    z.object({
      productId: z.string().uuid("Invalid product ID format"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ),
});

export const cartIdSchema = z.string().uuid("Invalid cart ID format");
