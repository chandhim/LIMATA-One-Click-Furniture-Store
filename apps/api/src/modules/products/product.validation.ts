import { z } from "zod";

export const listQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export type ListQuery = z.infer<typeof listQuerySchema>;
export type IdParam = z.infer<typeof idParamSchema>;
