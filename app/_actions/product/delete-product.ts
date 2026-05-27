"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/app/_lib/session";

export const deleteProduct = async (id: string) => {
  const { userId } = await verifySession();

  // Verifica se o produto existe e pertence ao usuário
  const product = await db.product.findFirst({
    where: { id, userId },
  });

  if (!product) {
    throw new Error("Produto não encontrado.");
  }

  // Verifica se o produto está vinculado a alguma venda
  const salesWithProduct = await db.saleProduct.findFirst({
    where: { productId: id },
  });

  if (salesWithProduct) {
    throw new Error(
      "Não é possível excluir este produto pois ele está vinculado a vendas existentes."
    );
  }

  await db.product.delete({
    where: { id },
  });

  revalidatePath("/products");
  revalidatePath("/sales");
};
