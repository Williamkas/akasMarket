import { z } from "zod";


export const registerSchema = z.object({
    email: z.string().email("The email address is not valid."),
    password: z.string().min(6, "The password must be at least 6 characters long."),
    name: z.string().min(2, "The name must be at least 2 characters long."),
    lastname: z.string().min(2, "The last name must be at least 2 characters long."),
  });
  


export const loginSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
  });