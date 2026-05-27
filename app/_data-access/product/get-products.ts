import { db } from "@/app/_lib/prisma";
import { verifySession } from "@/app/_lib/session";

export interface ProductRecord {
  id: string;
  name: string;
  price: unknown;
  stock: number;
  minStock: number;
  createdAt: Date;
  updatedAt: Date;
}

export const getProducts = async (): Promise<ProductRecord[]> => {
  const { userId } = await verifySession();
  return db.product.findMany({
    where: { userId },
  });
};