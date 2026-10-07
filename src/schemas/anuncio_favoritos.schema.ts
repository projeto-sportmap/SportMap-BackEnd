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

export const idParams = z.object({
  id: bigintId('id'),
});

export const listagemQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  usuarioId: bigintId('usuarioId').optional(),
});

export const createAnuncioFavoritosBody = z
  .object({
    // Provisório: enquanto não houver autenticação, vem do body.
    // Depois, remova este campo e use o id do token.
    usuarioId: bigintIdFlex('usuarioId'),
    anuncioId: bigintIdFlex('anuncioId'),
  })
  .strict();

export const createAnuncioFavoritosSchema = z.object({ body: createAnuncioFavoritosBody });
export const getAllAnuncioFavoritosSchema = z.object({ query: listagemQuery });
export const anuncioFavoritosIdSchema = z.object({ params: idParams });