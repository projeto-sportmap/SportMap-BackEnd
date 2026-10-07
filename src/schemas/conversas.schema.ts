import { z } from 'zod';
const MAX_BIGINT = 9223372036854775807n;

export const idParams = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID deve ser numérico.')
    .refine(value => {
      const id = BigInt(value);
      return id >= 1n && id <= MAX_BIGINT;
    }, 'ID fora do intervalo permitido.'),
});

export const paginacaoQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const createConversasBody = z.object({}).strict();

export const createConversasSchema = z.object({ body: createConversasBody });
export const getAllConversasSchema = z.object({ query: paginacaoQuery });
export const conversasIdSchema = z.object({ params: idParams });