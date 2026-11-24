import type { Request, Response } from 'express';
import { z } from 'zod';
import { HttpError } from '../lib/http-error.js';
import * as RecuperacaoSenhaService from '../services/recuperacao_senha.service.js';

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(255)
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'E-mail inválido.');

const esqueciSchema = z.object({ email: emailSchema });

const redefinirSchema = z.object({
  email: emailSchema,
  token: z.string().min(1, 'Token obrigatório.'),
  codigo: z.string().trim().regex(/^\d{6}$/, 'O código tem 6 dígitos.'),
  novaSenha: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .max(72, 'A senha deve ter no máximo 72 caracteres.'),
});

function ler<T>(schema: z.ZodType<T>, body: unknown): T {
  const resultado = schema.safeParse(body ?? {});
  if (!resultado.success) {
    throw new HttpError(400, resultado.error.issues[0]?.message ?? 'Dados inválidos.');
  }
  return resultado.data;
}

export const esqueciSenha = async (req: Request, res: Response) => {
  const { email } = ler(esqueciSchema, req.body);
  const { token } = await RecuperacaoSenhaService.solicitarRecuperacao(email);

  res.json({
    message: 'Se o e-mail estiver cadastrado, você receberá um código em instantes.',
    token,
  });
};

export const redefinirSenha = async (req: Request, res: Response) => {
  await RecuperacaoSenhaService.redefinirSenha(ler(redefinirSchema, req.body));

  res.json({ message: 'Senha alterada com sucesso.' });
};