"use server";

import { db } from "@/app/_lib/prisma";
import { createSession } from "@/app/_lib/session";
import {
  RegisterFormSchema,
  RegisterFormState,
} from "@/app/_lib/definitions";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function register(
  state: RegisterFormState,
  formData: FormData
) {
  // 1. Validar campos
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  // 2. Verificar se email já existe
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      message: "Este email já está em uso.",
    };
  }

  // 3. Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Criar usuário
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // 5. Criar sessão e redirecionar
  await createSession(user.id);
  redirect("/dashboard");
}
