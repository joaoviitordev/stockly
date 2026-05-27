"use client";

import { useActionState } from "react";
import { register } from "@/app/_actions/auth/register";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Button } from "@/app/_components/ui/button";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, undefined);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          Preencha os dados para criar sua conta
        </p>
      </div>

      <form action={action} className="space-y-4">
        {/* Mensagem de erro geral */}
        {state?.message && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {state.message}
          </div>
        )}

        {/* Nome */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Seu nome"
            required
          />
          {state?.errors?.name && (
            <p className="text-xs text-destructive">{state.errors.name[0]}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            required
          />
          {state?.errors?.email && (
            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        {/* Senha */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
          />
          {state?.errors?.password && (
            <p className="text-xs text-destructive">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        {/* Botão de submit */}
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={pending}
        >
          {pending ? (
            <>
              <LoaderIcon className="animate-spin" />
              Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
