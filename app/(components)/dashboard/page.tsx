import {
  CircleDollarSignIcon,
  CalendarIcon,
  ShoppingCartIcon,
  TrophyIcon,
  LucidePackage,
  AlertTriangleIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  getTotalRevenue,
  getTodayRevenue,
  getTotalSales,
  getTotalStock,
  getTotalProducts,
  getMostSoldProducts,
  getRevenueByMonth,
  getLowStockProducts,
} from "@/app/_data-access/dashboard/get-dashboard";
import { RevenueChart } from "./_components/revenue-chart";

export default async function Dashboard() {
  const [
    totalRevenue,
    todayRevenue,
    totalSales,
    totalStock,
    totalProducts,
    mostSoldProducts,
    revenueByMonth,
    lowStockProducts,
  ] = await Promise.all([
    getTotalRevenue(),
    getTodayRevenue(),
    getTotalSales(),
    getTotalStock(),
    getTotalProducts(),
    getMostSoldProducts(),
    getRevenueByMonth(),
    getLowStockProducts(),
  ]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex flex-col h-full">
      <div className="w-full flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-sm text-muted-foreground font-semibold">
            Informações gerais
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold">Dashboard</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 flex-1">
        {/* Lado Esquerdo - Métricas e Gráfico */}
        <div className="xl:col-span-3 flex flex-col gap-2">
          {/* Receita Total e Receita do Dia */}
          <div className="grid gap-2 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center gap-2">
                  <CardTitle className="text-lg font-medium">
                    Receita total
                  </CardTitle>
                  <CircleDollarSignIcon className="size-5 text-muted-foreground" />
                </div>
                <CardDescription>Todas as vendas já realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-row items-center gap-2">
                  <CardTitle className="text-lg font-medium">
                    Receita do dia
                  </CardTitle>
                  <CalendarIcon className="size-5 text-muted-foreground" />
                </div>
                <CardDescription>Vendas realizadas hoje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(todayRevenue)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vendas, Estoque e Produtos Totais lado a lado */}
          <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center gap-2">
                  <CardTitle className="text-lg font-medium">
                    Vendas totais
                  </CardTitle>
                  <ShoppingCartIcon className="size-5 text-muted-foreground" />
                </div>
                <CardDescription>Total de vendas realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSales}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-row items-center gap-2">
                  <CardTitle className="text-lg font-medium">
                    Estoque total
                  </CardTitle>
                  <LucidePackage className="size-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Quantidade de produtos em estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStock}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-row items-center gap-2">
                  <CardTitle className="text-lg font-medium">
                    Produtos totais
                  </CardTitle>
                  <ShoppingCartIcon className="size-5 text-muted-foreground" />
                </div>
                <CardDescription>Quantidade total de produtos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Receita */}
          <RevenueChart data={revenueByMonth} />
        </div>

        {/* Lado Direito - Produtos Mais Vendidos */}
        <div className="xl:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <CardTitle className="text-lg font-medium">
                  Produtos mais vendidos
                </CardTitle>
                <TrophyIcon className="size-5 text-muted-foreground" />
              </div>
              <CardDescription>
                Ranking dos 5 produtos com mais vendas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mostSoldProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma venda registrada.
                </p>
              ) : (
                <div className="space-y-4">
                  {mostSoldProducts.map((product, index) => (
                    <div
                      key={product.productId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p
                            className="text-sm font-medium leading-none truncate max-w-[120px] lg:max-w-[150px]"
                            title={product.name}
                          >
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {product.totalQuantity} un. vendidas
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold pl-2 text-right">
                        {formatCurrency(product.totalRevenue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card de Estoque Baixo */}
          <Card className="mt-2 h-72">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <CardTitle className="text-lg font-medium">
                  Estoque baixo
                </CardTitle>
                <AlertTriangleIcon className="size-5 text-yellow-500" />
              </div>
              <CardDescription>
                Produtos que precisam de reposição
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Todos os produtos estão com estoque adequado.
                </p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-500 text-sm font-bold">
                          !
                        </span>
                        <p
                          className="text-sm font-medium leading-none truncate max-w-[120px] lg:max-w-[150px]"
                          title={product.name}
                        >
                          {product.name}
                        </p>
                      </div>
                      <span className="text-sm font-semibold pl-2 text-right">
                        {product.stock}/{product.minStock} un.
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
