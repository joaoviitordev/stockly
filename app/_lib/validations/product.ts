import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, { message: "O nome do produto é obrigatório." }),
  price: z.number().min(0.01, { message: "O preço deve ser maior que zero." }),
  stock: z.number().min(0, { message: "O estoque não pode ser negativo." }),
  minStock: z.number().min(1, { message: "O estoque mínimo deve ser pelo menos 1." }),
});

export type ProductSchema = z.infer<typeof productSchema>;

export const editProductSchema = productSchema.extend({
  id: z.string().uuid({ message: "ID do produto inválido." }),
});

export type EditProductSchema = z.infer<typeof editProductSchema>;
