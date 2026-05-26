"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { PlusIcon, LoaderIcon } from "lucide-react";
import { createProduct } from "@/app/_actions/product/create-product";
import { productSchema, type ProductSchema } from "@/app/_lib/validations/product";

export default function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      minStock: 5,
    },
  });

  const { isSubmitting, isValid, isDirty } = form.formState;

  const handleSubmit = async (data: ProductSchema) => {
    try {
      await createProduct(data);
      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert(error instanceof Error ? error.message : "Erro ao criar produto.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) form.reset();
    }}>
      <DialogTrigger
        render={
          <Button className="cursor-pointer">
            <PlusIcon />
            Adicionar produto
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para cadastrar um novo produto.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 px-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Camiseta Básica" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0,00"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(parseFloat(e.target.value.replace(",", ".")) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estoque</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estoque mínimo</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5"
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="text-xs text-muted-foreground mt-[-10px]">
              Alerta quando o estoque atingir este valor
            </span>

            <DialogFooter className="mt-4">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderIcon className="animate-spin mr-2 size-4" />
                    Criando...
                  </>
                ) : (
                  "Criar produto"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}