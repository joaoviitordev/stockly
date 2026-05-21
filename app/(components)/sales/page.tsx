import { getSales } from "@/app/_data-access/sale/get-sales";
import { getProducts } from "@/app/_data-access/product/get-products";
import { CreateSaleSheet } from "./_components/create-sale-dialog";
import SalesDataTable from "./_components/sales-data-table";

export default async function SalesPage() {
  const [sales, products] = await Promise.all([getSales(), getProducts()]);

  const productOptions = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    stock: product.stock,
  }));

  return (
    <div className="w-full space-y-8 p-8">
      <div className="w-full flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-sm text-muted-foreground font-semibold">
            Histórico de vendas
          </span>
          <h2 className="text-2xl font-semibold">Vendas</h2>
        </div>
        <CreateSaleSheet products={productOptions} />
      </div>
      <SalesDataTable sales={sales} products={productOptions} />
    </div>
  );
}