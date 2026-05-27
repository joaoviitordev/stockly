"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/app/_lib/session";

import { saleSchema, type SaleSchema } from "@/app/_lib/validations/sale";

export const createSale = async (input: SaleSchema) => {
  const { userId } = await verifySession();

  const parsed = saleSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  if (input.items.length === 0) {
    throw new Error("O carrinho está vazio.");
  }

  // Busca todos os produtos referenciados (filtrando pelo usuário)
  const productIds = input.items.map((item) => item.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds }, userId },
  });

  // Valida existência e estoque de cada produto
  for (const item of input.items) {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      throw new Error(`Produto não encontrado: ${item.productId}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `Estoque insuficiente para "${product.name}". Disponível: ${product.stock}, solicitado: ${item.quantity}.`
      );
    }
  }

  await db.$transaction([
    // Cria a Sale com múltiplos SaleProducts
    db.sale.create({
      data: {
        date: new Date(),
        userId,
        products: {
          create: input.items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: item.productId,
              unitPrice: product.price,
              quantity: item.quantity,
            };
          }),
        },
      },
    }),
    // Decrementa estoque de cada produto
    ...input.items.map((item) =>
      db.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    ),
  ]);

  revalidatePath("/sales");
  revalidatePath("/products");
  revalidatePath("/dashboard");
};