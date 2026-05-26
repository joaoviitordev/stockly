"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
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
import { MoreHorizontalIcon, TrashIcon, LoaderIcon } from "lucide-react";
import { deleteSale } from "@/app/_actions/sale/delete-sale";
import type { SaleDto } from "./table-columns";

interface SaleTableActionsProps {
  sale: SaleDto;
}

export default function SaleTableActions({ sale }: SaleTableActionsProps) {
  const router = useRouter();

  /* --- Estado do alert dialog de exclusão --- */
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
            variant="destructive"
            className="cursor-pointer gap-2"
            onClick={() => setDeleteOpen(true)}
          >
            <TrashIcon />
            Excluir venda
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
