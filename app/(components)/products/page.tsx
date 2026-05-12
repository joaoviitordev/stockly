import { PlusIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { DataTable } from "@/app/_components/ui/data-table";
import { getProducts } from "@/app/_data-access/product/get-products";
import { productTableColumns } from "./_components/table-columns";

const ProductsPage = async () => {
  const products = await getProducts();
  
  const formattedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
    status: product.stock > 0 ? `Em estoque` : "Esgotado",
  }));

  return (
    <div className="w-full space-y-8 p-8">
      <div className="w-full flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-sm text-gray-500 font-semibold">
            Gerencie seus produtos
          </span>
          <h2 className="text-2xl font-semibold">Produtos</h2>
        </div>
        <Button className="cursor-pointer">
          <PlusIcon />
          Adicionar produto 
        </Button>
      </div>
      <DataTable columns={productTableColumns} data={formattedProducts} />
    </div>
  );
};

export default ProductsPage;
