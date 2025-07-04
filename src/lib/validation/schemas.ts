import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('The email address is not valid.'),
  password: z.string().min(6, 'The password must be at least 6 characters long.'),
  name: z.string().min(2, 'The name must be at least 2 characters long.'),
  lastname: z.string().min(2, 'The last name must be at least 2 characters long.')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.')
});

export const productCreateSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.number().positive('Price must be a positive number.'),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer.'),
  categories: z.array(z.string()).min(1, 'At least one category is required.'),
  images: z
    .array(z.string().url())
    .min(1, 'At least one image URL is required.')
    .max(15, 'A product can have up to 15 images.'),
  brand: z.string().min(2, 'Brand must be at least 2 characters long.'),
  discount: z.number().min(0, 'Discount must be at least 0%').max(100, 'Discount cannot exceed 100%').default(0),
  delivery_type: z.enum(['Retiro en sucursal', 'Envío a domicilio'])
});

export const productsSchema = z.object({
  page: z
    .string()
    // Se permite que el valor sea null:
    .nullable()
    // Se transforma null en los valores predeterminados "1" y "10":
    .transform((value) => (value === null ? '1' : value))
    // Se asegura que el valor no sea null y que sea un número válido. Si la validación es false se muestra el mensaje de error:
    .refine((value) => value !== null && !isNaN(parseInt(value)), {
      message: 'Page must be a number'
    })
    // Se transforma la cadena en un número entero.
    .transform((value) => (value === null ? 1 : parseInt(value))),

  limit: z
    .string()
    .nullable()
    .transform((value) => (value === null ? '10' : value))
    .refine((value) => value !== null && !isNaN(parseInt(value)), {
      message: 'Limit must be a number'
    })
    .transform((value) => (value === null ? 10 : parseInt(value))),
  search: z
    .string()
    .optional()
    // Se limpian espacios:
    .transform((val) => (val ? val.trim() : '')),
  // Campo por el que ordenamos (nombre o precio)
  sortBy: z
    .enum(['title', 'price'])
    .nullable()
    .transform((val) => val ?? 'title'),
  // Orden ascendente o descendente:
  order: z
    .enum(['asc', 'desc'])
    .nullable()
    .transform((val) => val ?? 'asc'),
  minPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  categories: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean)
        : undefined
    )
});

export const productIdSchema = z.string().uuid('Invalid product ID format');

export const cartItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID format'),
  quantity: z.number().min(1, 'Quantity must be at least 1')
});

// Esquema para POST (crear carrito)
export const createCartSchema = z.object({
  items: z.array(cartItemSchema)
});

// Esquema para PATCH (actualizar carrito)
export const updateCartSchema = z.object({
  items: z.array(cartItemSchema),
  updateType: z.enum(['set', 'increment'])
});

export const cartIdSchema = z.string().uuid('Invalid cart ID format');

export const changePasswordSchema = z.object({
  email: z.string().email('The email address is not valid.'),
  oldPassword: z.string().min(6, 'The old password must be at least 6 characters long.'),
  newPassword: z.string().min(6, 'The new password must be at least 6 characters long.')
});

export const sendResetEmailSchema = z.object({
  email: z.string().email('The email address is not valid.')
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'The password must be at least 6 characters long.'),
  token: z.string().min(1, 'Token is required.')
});

export const removeItemSchema = z.object({
  productId: z.string().uuid() // Aseguramos que el productId sea un UUID válido
});
