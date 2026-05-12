"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/app/_components/ui/badge";

// Prisma's Decimal type is not supported by React Server Components serialization.
// So we define a type that expects the price to be a number (after mapping).
export type ProductDto = {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
};

export const productTableColumns: ColumnDef<ProductDto>[] = [
  {
    accessorKey: "name",
    header: "Produtos",
  },
  {
    accessorKey: "price",
    header: "Valor unitário",
  },
  {
    accessorKey: "stock",
    header: "Estoque atual",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isOutOfStock = status === "Esgotado";
      return (
        <Badge
          variant={isOutOfStock ? "default" : "secondary"}
          className={
            isOutOfStock
              ? "flex items-center justify-center bg-red-500 text-white"
              : "flex items-center justify-center text-background bg-primary"
          }
        >
          {status}
        </Badge>
      );
    },
  },
];
