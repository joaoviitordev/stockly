"use client";

import { ColumnDef } from "@tanstack/react-table";

export type SaleDto = {
  id: string;
  productNames: string;
  totalQuantity: number;
  totalPrice: number;
  date: Date;
};

export const salesTableColumns: ColumnDef<SaleDto>[] = [
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
];