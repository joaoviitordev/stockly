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
import {
  PlusIcon,
  LoaderIcon,
  TrashIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { createSale } from "@/app/_actions/sale/create-sale";

interface ProductOption {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
}

interface CreateSaleSheetProps {
  products: ProductOption[];
}

export function CreateSaleSheet({ products }: CreateSaleSheetProps) {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);

  /* Calcula o estoque disponível descontando o que já está no carrinho */
  const getAvailableStock = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return 0;
    const cartItem = cart.find((item) => item.productId === productId);
    return product.stock - (cartItem?.quantity ?? 0);
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const availableStock = selectedProductId
    ? getAvailableStock(selectedProductId)
    : 0;

  /* Produtos disponíveis para seleção (que ainda têm estoque livre) */
  const availableProducts = products.filter(
    (p) => getAvailableStock(p.id) > 0
  );

  /* Totais do carrinho */
  const cartTotalItems = cart.length;
  const cartTotalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  /* Adicionar item ao carrinho */
  const handleAddToCart = () => {
    if (!selectedProduct || quantity <= 0 || quantity > availableStock) return;

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === selectedProductId
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === selectedProductId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: selectedProduct.id,
          name: selectedProduct.name,
          unitPrice: selectedProduct.price,
          quantity,
          maxStock: selectedProduct.stock,
        },
      ];
    });

    setSelectedProductId("");
    setQuantity(1);
  };

  /* Remover item do carrinho */
  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  /* Alterar quantidade de um item no carrinho */
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const clamped = Math.max(1, Math.min(newQuantity, product.stock));
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: clamped }
          : item
      )
    );
  };

  /* Limpar carrinho */
  const resetCart = () => {
    setCart([]);
    setSelectedProductId("");
    setQuantity(1);
  };

  /* Confirmar venda */
  const handleSubmit = async () => {
    if (cart.length === 0) return;

    setIsLoading(true);
    try {
      await createSale({
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      setOpen(false);
      resetCart();
      router.refresh();
    } catch (error) {
      console.error("Erro ao criar venda:", error);
      alert(error instanceof Error ? error.message : "Erro ao criar venda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetCart();
      }}
    >
      <DialogTrigger
        render={
          <Button className="cursor-pointer">
            <PlusIcon />
            Nova venda
          </Button>
        }
      />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova venda</DialogTitle>
          <DialogDescription>
            Adicione os produtos ao carrinho e confirme a venda.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-4">
          {/* ═══ Seção de adição ═══ */}
          <div className="flex flex-col gap-3">
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
                  {availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 items-end">
              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="quantity-input">Quantidade</Label>
                <Input
                  id="quantity-input"
                  type="number"
                  min={1}
                  max={availableStock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  disabled={!selectedProductId}
                />
              </div>
              <Button
                variant="secondary"
                className="cursor-pointer shrink-0"
                onClick={handleAddToCart}
                disabled={
                  !selectedProductId ||
                  quantity <= 0 ||
                  quantity > availableStock
                }
              >
                <PlusIcon className="size-4" />
                Adicionar
              </Button>
            </div>
            {selectedProduct && (
              <span className="text-xs text-muted-foreground">
                Estoque disponível: {availableStock} · Preço:{" "}
                {formatCurrency(selectedProduct.price)}
              </span>
            )}
          </div>

          {/* ═══ Carrinho ═══ */}
          {cart.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShoppingCartIcon className="size-4" />
                Carrinho ({cartTotalItems}{" "}
                {cartTotalItems === 1 ? "item" : "itens"})
              </div>
              <div className="rounded-lg border divide-y max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-2 p-2.5"
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(item.unitPrice)} × {item.quantity} ={" "}
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                    <Input
                      type="number"
                      min={1}
                      max={item.maxStock}
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.productId,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-16 h-8 text-center text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer shrink-0 size-8 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveFromCart(item.productId)}
                    >
                      <TrashIcon className="size-4" />
                      <span className="sr-only">Remover</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ Resumo ═══ */}
          {cart.length > 0 && (
            <div className="rounded-lg border p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total de itens</span>
                <span>{cartTotalItems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Total de unidades
                </span>
                <span>{cartTotalUnits}</span>
              </div>
              <div className="border-t my-1" />
              <div className="flex justify-between text-sm font-semibold">
                <span>Total da venda</span>
                <span>{formatCurrency(cartTotalPrice)}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            className="w-full cursor-pointer"
            onClick={handleSubmit}
            disabled={cart.length === 0 || isLoading}
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
