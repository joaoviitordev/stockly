import { db } from "@/app/_lib/prisma";
import { verifySession } from "@/app/_lib/session";

interface SaleProductRecord {
  id: string;
  saleId: string;
  productId: string;
  unitPrice: unknown;
  quantity: number;
  createAt: Date;
  updateAt: Date;
}

interface ProductRecord {
  id: string;
  name: string;
  price: unknown;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SaleWithProducts {
  id: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  products: SaleProductRecord[];
}

interface SaleProductWithProduct extends SaleProductRecord {
  product: ProductRecord;
}

export const getTotalRevenue = async (): Promise<number> => {
  const { userId } = await verifySession();
  const sales = await db.sale.findMany({
    where: { userId },
    include: { products: true },
  });
  return sales.reduce(
    (sum: number, sale: SaleWithProducts) =>
      sum +
      sale.products.reduce(
        (s: number, sp: SaleProductRecord) => s + Number(sp.unitPrice) * sp.quantity,
        0
      ),
    0
  );
};

export const getTodayRevenue = async (): Promise<number> => {
  const { userId } = await verifySession();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const sales: SaleWithProducts[] = await db.sale.findMany({
    where: {
      userId,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      products: true,
    },
  });

  return sales.reduce(
    (sum: number, sale: SaleWithProducts) =>
      sum +
      sale.products.reduce(
        (s: number, sp: SaleProductRecord) => s + Number(sp.unitPrice) * sp.quantity,
        0
      ),
    0
  );
};

export const getTotalSales = async (): Promise<number> => {
  const { userId } = await verifySession();
  return db.sale.count({ where: { userId } });
};

export const getTotalStock = async (): Promise<number> => {
  const { userId } = await verifySession();
  const result = await db.product.aggregate({
    where: { userId },
    _sum: { stock: true },
  });
  return result._sum.stock ?? 0;
};

export const getTotalProducts = async (): Promise<number> => {
  const { userId } = await verifySession();
  return db.product.count({ where: { userId } });
};

export interface MostSoldProductDto {
  productId: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
}

export const getMostSoldProducts = async (): Promise<MostSoldProductDto[]> => {
  const { userId } = await verifySession();
  const sales = await db.sale.findMany({
    where: { userId },
    include: {
      products: {
        include: { product: true },
      },
    },
  });

  // Flatten all sale products
  const saleProducts: SaleProductWithProduct[] = sales.flatMap(
    (sale) => sale.products as unknown as SaleProductWithProduct[]
  );

  // Agrupa por productId
  const grouped = saleProducts.reduce(
    (acc: Record<string, MostSoldProductDto>, sp: SaleProductWithProduct) => {
      if (!acc[sp.productId]) {
        acc[sp.productId] = {
          productId: sp.productId,
          name: sp.product.name,
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }
      acc[sp.productId].totalQuantity += sp.quantity;
      acc[sp.productId].totalRevenue +=
        Number(sp.unitPrice) * sp.quantity;
      return acc;
    },
    {} as Record<string, MostSoldProductDto>
  );

  return Object.values(grouped)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);
};

export interface MonthlyRevenueDto {
  month: string;
  revenue: number;
}

export const getRevenueByMonth = async (): Promise<MonthlyRevenueDto[]> => {
  const { userId } = await verifySession();
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const sales: SaleWithProducts[] = await db.sale.findMany({
    where: {
      userId,
      date: {
        gte: sixMonthsAgo,
      },
    },
    include: {
      products: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  // Nomes dos meses em português
  const monthNames = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];

  // Gera os últimos 6 meses como chaves
  const months: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]}/${d.getFullYear()}`;
    months[key] = 0;
  }

  // Soma a receita por mês
  for (const sale of sales) {
    const saleDate = new Date(sale.date);
    const key = `${monthNames[saleDate.getMonth()]}/${saleDate.getFullYear()}`;
    if (key in months) {
      months[key] += sale.products.reduce(
        (sum: number, sp: SaleProductRecord) => sum + Number(sp.unitPrice) * sp.quantity,
        0
      );
    }
  }

  return Object.entries(months).map(([month, revenue]) => ({
    month,
    revenue,
  }));
};

export interface LowStockProductDto {
  id: string;
  name: string;
  stock: number;
  minStock: number;
}

export const getLowStockProducts = async (): Promise<LowStockProductDto[]> => {
  const { userId } = await verifySession();
  const products = await db.product.findMany({
    where: {
      userId,
      stock: { gt: 0 },
    },
    select: {
      id: true,
      name: true,
      stock: true,
      minStock: true,
    },
    orderBy: { stock: "asc" },
  });

  // Filtra no JS pois o Prisma não suporta comparar colunas entre si diretamente
  return products.filter((p) => p.stock <= p.minStock);
};
