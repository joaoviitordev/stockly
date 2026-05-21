import { db } from "@/app/_lib/prisma";

export interface ProductRecord {
  id: string;
  name: string;
  price: unknown;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export const getProducts = async (): Promise<ProductRecord[]> => {
  return db.product.findMany();
};