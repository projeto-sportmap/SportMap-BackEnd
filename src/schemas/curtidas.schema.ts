import { z } from 'zod';

const idNumerico = (campo: string) =>
  z.string().refine((v) => /^\d+$/.test(v), { message: `${campo} deve ser numérico.` });

const idParams = z.object({ id: idNumerico('O ID') });

// Pode chegar como número ou string; vira string para o service converter em BigInt
const idBody = (campo: string) =>
  z
    .union([z.number().int().positive(), idNumerico(campo)], { error: `${campo} inválido.` })
    .transform((v) => String(v));

export const createCurtidaSchema = z.object({
  body: z.object({
    publicacaoId: idBody('publicacaoId'),
    usuarioId: idBody('usuarioId'),
  }),
});

export const curtidaIdSchema = z.object({
  params: idParams,
});

// GET /curtidas?publicacaoId=1&usuarioId=2
export const listCurtidasSchema = z.object({
  query: z.object({
    publicacaoId: idNumerico('publicacaoId').optional(),
    usuarioId: idNumerico('usuarioId').optional(),
  }),
});