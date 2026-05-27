import { z } from "zod/v4";

export const LoginFormSchema = z.object({
  email: z.email("Email inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export const RegisterFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .trim(),
  email: z.email("Email inválido."),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres.")
    .trim(),
});

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type RegisterFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
