"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateSaleInput {
  productId: string;
  quantity: number;
}

export const createSale = async (input: CreateSaleInput) => {
  const product = await db.product.findUnique({
    where: { id: input.productId },
  });

  if (!product) {
    throw new Error("Produto não encontrado.");
  }

  if (product.stock < input.quantity) {
    throw new Error("Estoque insuficiente.");
  }

  await db.$transaction([
    db.sale.create({
      data: {
        date: new Date(),
        products: {
          create: {
            productId: input.productId,
            unitPrice: product.price,
            quantity: input.quantity,
          },
        },
      },
    }),
    db.product.update({
      where: { id: input.productId },
      data: {
        stock: {
          decrement: input.quantity,
        },
      },
    }),
  ]);

  revalidatePath("/sales");
  revalidatePath("/products");
};

/* 
 - Server Action com "use server"
 - Valida existência do produto e estoque suficiente
 - Usa db.$transaction para atomicamente:
    - Criar Sale + SaleProduct
    - Decrementar estoque do produto
 - Revalida cache das páginas /sales e /products
*/  