"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

import { editProductSchema, type EditProductSchema } from "@/app/_lib/validations/product";

export const editProduct = async (input: EditProductSchema) => {
  const parsed = editProductSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

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
