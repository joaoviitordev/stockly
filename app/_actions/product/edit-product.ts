"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface EditProductInput {
  id: string;
  name: string;
  price: number;
  stock: number;
  minStock: number;
}

export const editProduct = async (input: EditProductInput) => {
  const product = await db.product.findUnique({
    where: { id: input.id },
  });

  if (!product) {
    throw new Error("Produto não encontrado.");
  }

  // Verifica se já existe outro produto com o mesmo nome
  if (input.name !== product.name) {
    const nameExists = await db.product.findFirst({
      where: {
        name: input.name,
        NOT: { id: input.id },
      },
    });

    if (nameExists) {
      throw new Error("Já existe um produto com esse nome.");
    }
  }

  await db.product.update({
    where: { id: input.id },
    data: {
      name: input.name,
      price: input.price,
      stock: input.stock,
      minStock: input.minStock,
    },
  });

  // Revalida ambas as rotas para refletir mudanças de nome nos dois locais
  revalidatePath("/products");
  revalidatePath("/sales");
};
