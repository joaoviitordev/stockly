"use client";

import { DataTable } from "@/app/_components/ui/data-table";
import { salesTableColumns, SaleDto } from "./table-columns";

interface SalesDataTableProps {
  sales: SaleDto[];
}

export default function SalesDataTable({ sales }: SalesDataTableProps) {
  return <DataTable columns={salesTableColumns} data={sales} />;
}
