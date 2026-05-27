"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/app/_lib/session";

export const deleteSale = async (saleId: string) => {
  const { userId } = await verifySession();

  // Busca a venda com seus produtos vinculados (filtrando pelo usuário)
  const sale = await db.sale.findFirst({
    where: { id: saleId, userId },
    include: { products: true },
  });

  if (!sale) {
    throw new Error("Venda não encontrada.");
  }

  await db.$transaction([
    // 1. Restaura o estoque de cada produto vinculado à venda
    ...sale.products.map((sp) =>
      db.product.update({
        where: { id: sp.productId },
        data: {
          stock: {
            increment: sp.quantity,
          },
        },
      })
    ),
    // 2. Remove todos os SaleProducts da venda
    db.saleProduct.deleteMany({
      where: { saleId },
    }),
    // 3. Remove a venda em si
    db.sale.delete({
      where: { id: saleId },
    }),
  ]);

  revalidatePath("/sales");
  revalidatePath("/products");
  revalidatePath("/dashboard");
};
