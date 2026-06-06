import { z } from "zod";

export const listQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const productCreateSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
  category: z.string().min(1, "Category is required"),
  material: z.string().optional(),
  images: z.array(z.string()).optional(),
  model3dUrl: z.string().nullable().optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ListQuery = z.infer<typeof listQuerySchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
