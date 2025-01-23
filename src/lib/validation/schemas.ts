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

// Esquema para los parámetros de paginación de productos
export const productsSchema = z.object({
  page: z
    .string()
    .default("1")
    // El .refine() evalua si es false o true. Si es false se muestra el mensaje de error:
    .refine((value) => !isNaN(parseInt(value)), {
      message: "Page must be a number",
    })
    .transform((value) => parseInt(value)),

  limit: z
    .string()
    .default("10")
    .refine((value) => !isNaN(parseInt(value)), {
      message: "Limit must be a number",
    })
    .transform((value) => parseInt(value)),
});

// Esquema de validación para el ID del producto
export const productIdSchema = z.string().uuid("Invalid product ID format");
