import { z } from "zod";

export const saleItemSchema = z.object({
  productId: z.string().uuid({ message: "ID do produto inválido." }),
  quantity: z.number().min(1, { message: "A quantidade deve ser de pelo menos 1." }),
});

export const saleSchema = z.object({
  items: z.array(saleItemSchema).min(1, { message: "A venda deve conter pelo menos um item." }),
});

export type SaleSchema = z.infer<typeof saleSchema>;
