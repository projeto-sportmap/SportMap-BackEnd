import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(255, 'O e-mail deve ter no máximo 255 caracteres.')
      .pipe(z.email('Formato de e-mail inválido.')),

    password: z
      .string()
      .min(1, 'A senha é obrigatória.')
      .max(72, 'A senha deve ter no máximo 72 caracteres.'),
  }).strict(),
});