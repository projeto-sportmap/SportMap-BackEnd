import { z } from 'zod';

const idNumerico = (campo: string) =>
  z.string().refine((v) => /^\d+$/.test(v), { message: `${campo} deve ser numérico.` });

const idParams = z.object({ id: idNumerico('O ID') });

// Mesmos valores do ck_usuario_esportes_nivel
const NIVEIS = ['iniciante', 'intermediario', 'avancado', 'profissional'] as const;
const nivel = z.enum(NIVEIS, {
  error: `nivel deve ser um destes: ${NIVEIS.join(', ')}.`,
});

// usuarioId pode chegar como número ou string; vira string para o service converter em BigInt
const usuarioIdBody = z
  .union([z.number().int().positive(), idNumerico('O usuarioId')], { error: 'usuarioId inválido.' })
  .transform((v) => String(v));

const esporteIdBody = z
  .number('esporteId deve ser um número.')
  .int('esporteId deve ser inteiro.')
  .min(1, 'esporteId inválido.')
  .max(2147483647, 'esporteId inválido.');

export const createUsuarioEsporteSchema = z.object({
  body: z.object({
    usuarioId: usuarioIdBody,
    esporteId: esporteIdBody,
    nivel: nivel.optional(), // se omitido, o banco usa 'iniciante'
  }),
});

// Só o nível pode ser alterado
export const updateUsuarioEsporteSchema = z.object({
  body: z.object({
    nivel,
  }),
  params: idParams,
});

export const usuarioEsporteIdSchema = z.object({
  params: idParams,
});

// GET /usuario-esportes?usuarioId=1&esporteId=2
export const listUsuarioEsportesSchema = z.object({
  query: z.object({
    usuarioId: idNumerico('usuarioId').optional(),
    esporteId: idNumerico('esporteId').optional(),
  }),
});