import { db } from "@/app/_lib/prisma";

export interface SaleDtoFromDb {
  id: string;
  productId: string;
  productNames: string;
  totalQuantity: number;
  totalPrice: number;
  date: Date;
}

interface ProductRecord {
  id: string;
  name: string;
  price: unknown;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SaleProductRecord {
  id: string;
  saleId: string;
  productId: string;
  unitPrice: unknown;
  quantity: number;
  createAt: Date;
  updateAt: Date;
  product: ProductRecord;
}

interface SaleRecord {
  id: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  products: SaleProductRecord[];
}

export const getSales = async (): Promise<SaleDtoFromDb[]> => {
  const sales: SaleRecord[] = await db.sale.findMany({
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

  return sales.map((sale: SaleRecord) => ({
    id: sale.id,
    productId: sale.products[0]?.productId ?? "",
    productNames: sale.products
      .map((sp: SaleProductRecord) => sp.product.name)
      .join(", "),
    totalQuantity: sale.products.reduce((sum: number, sp: SaleProductRecord) => sum + sp.quantity, 0),
    totalPrice: sale.products.reduce(
      (sum: number, sp: SaleProductRecord) => sum + Number(sp.unitPrice) * sp.quantity,
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