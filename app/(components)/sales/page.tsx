import { Button } from "@/app/_components/ui/button";
import { PlusIcon } from "lucide-react";

export default function SalesPage() {
    return (
        <div className="w-full space-y-8 p-8">
      <div className="w-full flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-sm text-gray-500 font-semibold">
            Histórico de vendas
          </span>
          <h2 className="text-2xl font-semibold">Vendas</h2>
        </div>
        <Button className="cursor-pointer">
          <PlusIcon />
          Nova venda
        </Button>
      </div>
    </div>
    );
}