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
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Button } from "@/app/_components/ui/button";
import { PlusIcon, LoaderIcon } from "lucide-react";
import { createProduct } from "@/app/_actions/product/create-product";

export default function CreateProductDialog() {
  /* Estado para controlar abertura/fechamento do dialog */
  const [open, setOpen] = useState(false);

  /* Estados dos campos do formulário */
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  /* Estado de loading durante o submit */
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  /* Validação: desabilita o botão se campos obrigatórios estiverem vazios ou inválidos */
  const isFormValid = name.trim().length > 0 && price > 0 && stock >= 0;

  /* Reseta os campos do formulário para o estado inicial */
  const resetForm = () => {
    setName("");
    setPrice(0);
    setStock(0);
  };

  /* Handler de submit — chama a server action e trata erros */
  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      await createProduct({
        name: name.trim(),
        price,
        stock,
      });

      /* Fecha o dialog e limpa os campos após sucesso */
      setOpen(false);
      resetForm();
      router.refresh();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert(error instanceof Error ? error.message : "Erro ao criar produto.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Botão que abre o dialog */}
      <DialogTrigger
        render={
          <Button className="cursor-pointer">
            <PlusIcon />
            Adicionar produto
          </Button>
        }
      />
      <DialogContent>
        {/* Cabeçalho com título e descrição */}
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para cadastrar um novo produto.
          </DialogDescription>
        </DialogHeader>

        {/* Formulário com os campos do produto */}
        <div className="flex flex-col gap-4 px-4">
          {/* Nome do produto */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="product-name">Nome</Label>
            <Input
              id="product-name"
              type="text"
              placeholder="Ex: Camiseta Básica"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Preço unitário — aceita apenas valores positivos */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="product-price">Preço (R$)</Label>
            <Input
              id="product-price"
              type="number"
              min={0.01}
              step={0.01}
              placeholder="0,00"
              value={price || ""}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Quantidade em estoque */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="product-stock">Estoque</Label>
            <Input
              id="product-stock"
              type="number"
              min={0}
              placeholder="0"
              value={stock || ""}
              onChange={(e) => setStock(parseInt(e.target.value) || 0)}
            />
          </div>

          {/* Resumo do produto — aparece somente quando o formulário é válido */}
          {isFormValid && (
            <div className="rounded-lg border p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Produto</span>
                <span>{name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Preço</span>
                <span>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(price)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estoque</span>
                <span>{stock} un.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer com botão de confirmação e estado de loading */}
        <DialogFooter>
          <Button
            className="w-full cursor-pointer"
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <LoaderIcon className="animate-spin" />
                Criando...
              </>
            ) : (
              "Criar produto"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/*
  - Componente client-side com Dialog (modal centralizado)
  - Inputs para nome, preço e estoque do produto
  - Resumo dinâmico exibido quando o formulário está válido
  - Validação de campos obrigatórios (nome não vazio, preço > 0)
  - Chama a server action createProduct no submit
  - Loading state no botão de submit
  - Reset automático dos campos após criação bem-sucedida
*/