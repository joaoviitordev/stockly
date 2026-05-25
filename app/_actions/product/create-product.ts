"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
  minStock: number;
}

export const createProduct = async (input: CreateProductInput) => {
  const productExists = await db.product.findFirst({
    where: { name: input.name },
  });

  if (productExists) {
    throw new Error("Produto já existe.");
  }

  await db.product.create({
    data: {
      name: input.name,
      price: input.price,
      stock: input.stock,
      minStock: input.minStock,
    },
  });

  revalidatePath("/products");
};