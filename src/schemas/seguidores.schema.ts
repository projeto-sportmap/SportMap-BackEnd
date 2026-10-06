import { z } from 'zod';

const MAX_BIGINT = 9223372036854775807n;
const bigintId = (campo: string) => z
    .string({ error: `${campo} é obrigatório.` })
    .regex(/^\d+$/, `${campo} deve ser numérico.`)
    .refine(value => {
      const id = BigInt(value);
      return id >= 1n && id <= MAX_BIGINT;
    }, `${campo} fora do intervalo permitido.`);

export const seguidoresParams = z.object({
  seguidorId: bigintId('seguidorId'),
  seguidoId: bigintId('seguidoId'),
});

export const paginacaoQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const createSeguidoresBody = z
  .object({
    seguidorId: z.union([z.string(), z.number()]).transform(String).pipe(bigintId('seguidorId')),
    seguidoId: z.union([z.string(), z.number()]).transform(String).pipe(bigintId('seguidoId')),
  })
  .strict()
  .refine(
    value => value.seguidorId !== value.seguidoId,
    { message: 'Um usuário não pode seguir a si mesmo.', path: ['seguidoId'] },
  );

export const createSeguidoresSchema = z.object({ body: createSeguidoresBody });
export const getAllSeguidoresSchema = z.object({ query: paginacaoQuery });
export const seguidoresIdSchema = z.object({ params: seguidoresParams });