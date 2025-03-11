import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email({ message: "Insira um email válido!" }),

  password: z
    .string()
    .min(6, { message: "Senha deve ter 6 ou mais caracteres" }),
});

export const signUpSchema = authSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas devem ser iguais",
    path: ["confirmPassword"],
  });
