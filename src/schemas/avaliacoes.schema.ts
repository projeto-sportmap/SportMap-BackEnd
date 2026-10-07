import { z } from 'zod';

const MAX_BIGINT = 9223372036854775807n;

const bigintId = (campo: string) =>
  z
    .string()
    .regex(/^\d+$/, `${campo} deve ser numérico.`)
    .refine(value => {
      const id = BigInt(value);
      return id >= 1n && id <= MAX_BIGINT;
    }, `${campo} fora do intervalo permitido.`);

const bigintIdFlex = (campo: string) =>
  z.union([z.string(), z.number()]).transform(String).pipe(bigintId(campo));

const nota = z.coerce
  .number()
  .int('Nota deve ser um inteiro.')
  .min(1, 'Nota mínima é 1.')
  .max(5, 'Nota máxima é 5.');

const comentario = z.string().trim().max(1000, 'Comentário deve ter no máximo 1000 caracteres.');

export const idParams = z.object({
  id: bigintId('id'),
});

export const anuncioIdParams = z.object({
  anuncioId: bigintId('anuncioId'),
});

export const listagemQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  anuncioId: bigintId('anuncioId').optional(),
});

export const createAvaliacoesBody = z
  .object({
    // Provisório: enquanto não houver middleware de autenticação, vem do body.
    // Depois, remova este campo e use o id do token.
    avaliadorId: bigintIdFlex('avaliadorId'),
    anuncioId: bigintIdFlex('anuncioId'),
    nota,
    comentario: comentario.nullable().optional(),
  })
  .strict();

export const updateAvaliacoesBody = z
  .object({
    nota: nota.optional(),
    comentario: comentario.nullable().optional(),
  })
  .strict()
  .refine(value => Object.keys(value).length > 0, 'Informe pelo menos um campo.');

export const createAvaliacoesSchema = z.object({ body: createAvaliacoesBody });
export const updateAvaliacoesSchema = z.object({ body: updateAvaliacoesBody, params: idParams });
export const getAllAvaliacoesSchema = z.object({ query: listagemQuery });
export const avaliacoesIdSchema = z.object({ params: idParams });
export const mediaAvaliacoesSchema = z.object({ params: anuncioIdParams });