"use client";

import { DataTable } from "@/app/_components/ui/data-table";
import { createSalesTableColumns, SaleDto } from "./table-columns";

interface ProductOption {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface SalesDataTableProps {
  sales: SaleDto[];
  products: ProductOption[];
}

export default function SalesDataTable({
  sales,
  products,
}: SalesDataTableProps) {
  const columns = createSalesTableColumns(products);
  return <DataTable columns={columns} data={sales} />;
}
