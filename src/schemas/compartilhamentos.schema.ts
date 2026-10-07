import { z } from 'zod';

const MAX_BIGINT = 9223372036854775807n;

const bigintId = (campo: string) =>
  z
    .string({ error: `${campo} é obrigatório.` })
    .regex(/^\d+$/, `${campo} deve ser numérico.`)
    .refine(value => {
      const id = BigInt(value);
      return id >= 1n && id <= MAX_BIGINT;
    }, `${campo} fora do intervalo permitido.`);

export const idParams = z.object({
  id: bigintId('id'),
});

export const paginacaoQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const createCompartilhamentosBody = z
  .object({
    publicacaoId: z.union([z.string(), z.number()]).transform(String).pipe(bigintId('publicacaoId')),
    usuarioId: z.union([z.string(), z.number()]).transform(String).pipe(bigintId('usuarioId')),
  })
  .strict();

export const createCompartilhamentosSchema = z.object({ body: createCompartilhamentosBody });
export const getAllCompartilhamentosSchema = z.object({ query: paginacaoQuery });
export const compartilhamentosIdSchema = z.object({ params: idParams });