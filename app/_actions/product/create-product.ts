"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

import { productSchema, type ProductSchema } from "@/app/_lib/validations/product";

export const createProduct = async (input: ProductSchema) => {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

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