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
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  MoreHorizontalIcon,
  CopyIcon,
  PencilIcon,
  TrashIcon,
  LoaderIcon,
} from "lucide-react";
import { deleteProduct } from "@/app/_actions/product/delete-product";
import { editProduct } from "@/app/_actions/product/edit-product";
import type { ProductDto } from "./table-columns";

interface ProductTableActionsProps {
  product: ProductDto;
}

export default function ProductTableActions({
  product,
}: ProductTableActionsProps) {
  const router = useRouter();

  /* --- Estado do dialog de edição --- */
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(product.name);
  const [editPrice, setEditPrice] = useState(product.price);
  const [editStock, setEditStock] = useState(product.stock);
  const [isEditing, setIsEditing] = useState(false);

  /* --- Estado do alert dialog de exclusão --- */
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isEditFormValid =
    editName.trim().length > 0 && editPrice > 0 && editStock >= 0;

  /* Copiar ID do produto para a área de transferência */
  const handleCopyId = async () => {
    await navigator.clipboard.writeText(product.id);
  };

  /* Abrir dialog de edição e resetar campos com valores atuais */
  const handleOpenEdit = () => {
    setEditName(product.name);
    setEditPrice(product.price);
    setEditStock(product.stock);
    setEditOpen(true);
  };

  /* Confirmar edição */
  const handleEdit = async () => {
    if (!isEditFormValid) return;

    setIsEditing(true);
    try {
      await editProduct({
        id: product.id,
        name: editName.trim(),
        price: editPrice,
        stock: editStock,
      });
      setEditOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao editar produto."
      );
    } finally {
      setIsEditing(false);
    }
  };

  /* Confirmar exclusão */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao excluir produto."
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
            onClick={handleCopyId}
          >
            <CopyIcon />
            Copiar ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={handleOpenEdit}
          >
            <PencilIcon />
            Editar produto
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer gap-2"
            onClick={() => setDeleteOpen(true)}
          >
            <TrashIcon />
            Excluir produto
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de Edição */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar produto</DialogTitle>
            <DialogDescription>
              Altere as informações do produto abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 px-4">
            {/* Nome */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-product-name">Nome</Label>
              <Input
                id="edit-product-name"
                type="text"
                placeholder="Ex: Camiseta Básica"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            {/* Preço */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-product-price">Preço (R$)</Label>
              <Input
                id="edit-product-price"
                type="number"
                min={0.01}
                step={0.01}
                placeholder="0,00"
                value={editPrice || ""}
                onChange={(e) =>
                  setEditPrice(parseFloat(e.target.value) || 0)
                }
              />
            </div>

            {/* Estoque */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-product-stock">Estoque</Label>
              <Input
                id="edit-product-stock"
                type="number"
                min={0}
                placeholder="0"
                value={editStock || ""}
                onChange={(e) =>
                  setEditStock(parseInt(e.target.value) || 0)
                }
              />
            </div>

            {/* Resumo das alterações */}
            {isEditFormValid && (
              <div className="rounded-lg border p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Produto</span>
                  <span>{editName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Preço</span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(editPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estoque</span>
                  <span>{editStock} un.</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              className="w-full cursor-pointer"
              onClick={handleEdit}
              disabled={!isEditFormValid || isEditing}
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
            <AlertDialogTitle>Excluir produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto{" "}
              <strong>{product.name}</strong>? Esta ação não pode ser
              desfeita.
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
