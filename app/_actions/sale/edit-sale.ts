"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface EditSaleInput {
  saleId: string;
  productId: string;
  quantity: number;
}

export const editSale = async (input: EditSaleInput) => {
  // Busca a venda com seus produtos
  const sale = await db.sale.findUnique({
    where: { id: input.saleId },
    include: { products: true },
  });

  if (!sale) {
    throw new Error("Venda não encontrada.");
  }

  // Busca o novo produto selecionado
  const newProduct = await db.product.findUnique({
    where: { id: input.productId },
  });

  if (!newProduct) {
    throw new Error("Produto não encontrado.");
  }

  const oldSaleProduct = sale.products[0];
  if (!oldSaleProduct) {
    throw new Error("Dados da venda inconsistentes.");
  }

  const oldProductId = oldSaleProduct.productId;
  const oldQuantity = oldSaleProduct.quantity;

  // Calcula o ajuste de estoque necessário
  const isSameProduct = oldProductId === input.productId;

  if (isSameProduct) {
    // Mesmo produto — só ajusta a diferença de quantidade
    const quantityDiff = input.quantity - oldQuantity;

    if (quantityDiff > 0 && newProduct.stock < quantityDiff) {
      throw new Error("Estoque insuficiente.");
    }

    await db.$transaction([
      // Atualiza o SaleProduct
      db.saleProduct.update({
        where: { id: oldSaleProduct.id },
        data: {
          quantity: input.quantity,
          unitPrice: newProduct.price,
        },
      }),
      // Ajusta o estoque
      db.product.update({
        where: { id: input.productId },
        data: {
          stock: {
            decrement: quantityDiff,
          },
        },
      }),
    ]);
  } else {
    // Produto diferente — devolve estoque do antigo, desconta do novo
    if (newProduct.stock < input.quantity) {
      throw new Error("Estoque insuficiente para o novo produto.");
    }

    await db.$transaction([
      // Devolve estoque do produto antigo
      db.product.update({
        where: { id: oldProductId },
        data: {
          stock: {
            increment: oldQuantity,
          },
        },
      }),
      // Desconta estoque do novo produto
      db.product.update({
        where: { id: input.productId },
        data: {
          stock: {
            decrement: input.quantity,
          },
        },
      }),
      // Atualiza o SaleProduct
      db.saleProduct.update({
        where: { id: oldSaleProduct.id },
        data: {
          productId: input.productId,
          quantity: input.quantity,
          unitPrice: newProduct.price,
        },
      }),
    ]);
  }

  revalidatePath("/sales");
  revalidatePath("/products");
};
