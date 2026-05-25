"use client";

import { ColumnDef } from "@tanstack/react-table";
import SaleTableActions from "./sale-table-actions";

export type SaleDto = {
  id: string;
  productId: string;
  productNames: string;
  totalQuantity: number;
  totalPrice: number;
  date: Date;
};

interface ProductOption {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export const createSalesTableColumns = (
  products: ProductOption[]
): ColumnDef<SaleDto>[] => [
  {
    accessorKey: "productNames",
    header: "Produtos",
  },
  {
    accessorKey: "totalQuantity",
    header: "Quantidade",
  },
  {
    accessorKey: "totalPrice",
    header: "Valor total",
    cell: ({ row }) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(row.original.totalPrice);
    },
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(row.original.date));
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return <SaleTableActions sale={row.original} products={products} />;
    },
  },
];