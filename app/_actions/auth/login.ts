"use server";

import { db } from "@/app/_lib/prisma";
import { createSession } from "@/app/_lib/session";
import { LoginFormSchema, LoginFormState } from "@/app/_lib/definitions";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function login(state: LoginFormState, formData: FormData) {
  // 1. Validar campos
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // 2. Buscar usuário por email
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      message: "Email ou senha incorretos.",
    };
  }

  // 3. Comparar senha
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return {
      message: "Email ou senha incorretos.",
    };
  }

  // 4. Criar sessão e redirecionar
  await createSession(user.id);
  redirect("/dashboard");
}
