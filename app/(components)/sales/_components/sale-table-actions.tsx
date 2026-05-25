"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";
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
import { MoreHorizontalIcon, PencilIcon, TrashIcon, LoaderIcon } from "lucide-react";
import { editSale } from "@/app/_actions/sale/edit-sale";
import { deleteSale } from "@/app/_actions/sale/delete-sale";
import type { SaleDto } from "./table-columns";

interface ProductOption {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface SaleTableActionsProps {
  sale: SaleDto;
  products: ProductOption[];
}

export default function SaleTableActions({
  sale,
  products,
}: SaleTableActionsProps) {
  const router = useRouter();

  /* --- Estado do dialog de edição --- */
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    sale.productId
  );
  const [quantity, setQuantity] = useState<number>(sale.totalQuantity);
  const [isEditing, setIsEditing] = useState(false);

  /* --- Estado do alert dialog de exclusão --- */
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  /* Abrir dialog de edição e resetar campos com valores atuais */
  const handleOpenEdit = () => {
    setSelectedProductId(sale.productId);
    setQuantity(sale.totalQuantity);
    setEditOpen(true);
  };

  /* Confirmar edição */
  const handleEdit = async () => {
    if (!selectedProductId || quantity <= 0) return;

    setIsEditing(true);
    try {
      await editSale({
        saleId: sale.id,
        productId: selectedProductId,
        quantity,
      });
      setEditOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Erro ao editar venda:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao editar venda."
      );
    } finally {
      setIsEditing(false);
    }
  };

  /* Confirmar exclusão */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSale(sale.id);
      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Erro ao excluir venda:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao excluir venda."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Dropdown Menu de Ações */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <MoreHorizontalIcon />
              <span className="sr-only">Abrir menu de ações</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={handleOpenEdit}
          >
            <PencilIcon />
            Editar venda
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer gap-2"
            onClick={() => setDeleteOpen(true)}
          >
            <TrashIcon />
            Excluir venda
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de Edição */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar venda</DialogTitle>
            <DialogDescription>
              Altere o produto e a quantidade desta venda.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 px-4">
            {/* Seleção do produto */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-sale-product">Produto</Label>
              <Select
                value={selectedProductId}
                onValueChange={(value) => {
                  setSelectedProductId(value as string);
                  setQuantity(1);
                }}
              >
                <SelectTrigger id="edit-sale-product" className="w-full">
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
              <Label htmlFor="edit-sale-quantity">Quantidade</Label>
              <Input
                id="edit-sale-quantity"
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
              onClick={handleEdit}
              disabled={!selectedProductId || quantity <= 0 || isEditing}
            >
              {isEditing ? (
                <>
                  <LoaderIcon className="animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir venda</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta venda de{" "}
              <strong>{sale.productNames}</strong>? O estoque dos produtos será
              restaurado automaticamente. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <LoaderIcon className="animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
