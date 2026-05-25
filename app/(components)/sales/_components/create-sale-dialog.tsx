"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Button } from "@/app/_components/ui/button";
import { PlusIcon, LoaderIcon } from "lucide-react";
import { createSale } from "@/app/_actions/sale/create-sale";

interface ProductOption {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CreateSaleSheetProps {
  products: ProductOption[];
}

export function CreateSaleSheet({ products }: CreateSaleSheetProps) {
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const unitPrice = selectedProduct?.price ?? 0;
  const totalPrice = unitPrice * quantity;
  const maxStock = selectedProduct?.stock ?? 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);

  const handleSubmit = async () => {
    if (!selectedProductId || quantity <= 0) return;

    setIsLoading(true);
    try {
      await createSale({
        productId: selectedProductId,
        quantity,
      });
      setOpen(false);
      setSelectedProductId("");
      setQuantity(1);
      router.refresh();
    } catch (error) {
      console.error("Erro ao criar venda:", error);
      alert(error instanceof Error ? error.message : "Erro ao criar venda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="cursor-pointer">
            <PlusIcon />
            Nova venda
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova venda</DialogTitle>
          <DialogDescription>
            Selecione o produto e a quantidade para registrar uma nova venda.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-4">
          {/* Seleção do produto */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="product-select">Produto</Label>
            <Select
              value={selectedProductId}
              onValueChange={(value) => {
                setSelectedProductId(value as string);
                setQuantity(1);
              }}
            >
              <SelectTrigger id="product-select" className="w-full">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantidade */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity-input">Quantidade</Label>
            <Input
              id="quantity-input"
              type="number"
              min={1}
              max={maxStock}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              disabled={!selectedProductId}
            />
            {selectedProduct && (
              <span className="text-xs text-muted-foreground">
                Estoque disponível: {maxStock}
              </span>
            )}
          </div>

          {/* Resumo */}
          {selectedProduct && (
            <div className="rounded-lg border p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Preço unitário</span>
                <span>{formatCurrency(unitPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quantidade</span>
                <span>{quantity}</span>
              </div>
              <div className="border-t my-1" />
              <div className="flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            className="w-full cursor-pointer"
            onClick={handleSubmit}
            disabled={!selectedProductId || quantity <= 0 || isLoading}
          >
            {isLoading ? (
              <>
                <LoaderIcon className="animate-spin" />
                Criando...
              </>
            ) : (
              "Confirmar venda"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* 
  - Componente client-side com Sheet (painel lateral)
  - Select dropdown com produtos reais do banco
  - Input de quantidade com limite baseado no estoque
  - Resumo com preço unitário, quantidade e total formatados em R$
  - Loading state no botão de submit
*/
