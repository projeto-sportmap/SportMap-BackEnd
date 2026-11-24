import { z } from 'zod';

const idParams = z.object({
  id: z.string().refine((val) => /^\d+$/.test(val), { message: 'O ID deve ser numérico.' }),
});

const nome = z
  .string()
  .trim()
  .min(2, 'O nome deve ter pelo menos 2 caracteres.')
  .max(100, 'O nome deve ter no máximo 100 caracteres.');

const bio = z.string().trim().max(255, 'A bio deve ter no máximo 255 caracteres.').nullish();

const fotoUrl = z.string().trim().max(500, 'A URL da foto deve ter no máximo 500 caracteres.').nullish();

const esporteId = z.number('O esporte deve ser um número.').int('O esporte deve ser um número inteiro.').positive().nullish();

export const createComunidadeSchema = z.object({
  body: z.object({
    nome,
    bio,
    fotoUrl,
    esporteId,
  }),
});

export const updateComunidadeSchema = z.object({
  body: z
    .object({
      nome: nome.optional(),
      bio,
      fotoUrl,
      esporteId,
    })
    .refine((body) => Object.keys(body).length > 0, { message: 'Informe pelo menos um campo.' }),
  params: idParams,
});

export const comunidadeIdSchema = z.object({
  params: idParams,
});