import { db } from "@/app/_lib/prisma";

export interface SaleDtoFromDb {
  id: string;
  productNames: string;
  totalQuantity: number;
  totalPrice: number;
  date: Date;
}

export const getSales = async (): Promise<SaleDtoFromDb[]> => {
  const sales = await db.sale.findMany({
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return sales.map((sale) => ({
    id: sale.id,
    productNames: sale.products
      .map((sp) => sp.product.name)
      .join(", "),
    totalQuantity: sale.products.reduce((sum, sp) => sum + sp.quantity, 0),
    totalPrice: sale.products.reduce(
      (sum, sp) => sum + Number(sp.unitPrice) * sp.quantity,
      0
    ),
    date: sale.date,
  }));
};


/*
  - Busca vendas do banco via Prisma com include de products → product
  - Mapeia os dados para o formato SaleDtoFromDb (nomes dos produtos concatenados, quantidade total, preço total)
  - Ordena por data decrescente
*/    