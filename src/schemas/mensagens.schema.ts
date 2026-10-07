import { z } from 'zod';

const MAX_BIGINT = 9223372036854775807n;
const MAX_CONTEUDO = 5000;

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

const conteudo = z
  .string()
  .trim()
  .min(1, 'Conteúdo obrigatório.')
  .max(MAX_CONTEUDO, `Conteúdo deve ter no máximo ${MAX_CONTEUDO} caracteres.`);

export const idParams = z.object({
  id: bigintId('id'),
});

export const listagemQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  conversaId: bigintId('conversaId').optional(),
});

export const createMensagensBody = z
  .object({
    conversaId: bigintIdFlex('conversaId'),
    // Provisório: enquanto não houver middleware de autenticação, vem do body.
    // Depois, remova este campo e use o id do token.
    remetenteId: bigintIdFlex('remetenteId'),
    conteudo,
  })
  .strict();

export const createMensagensSchema = z.object({ body: createMensagensBody });
export const getAllMensagensSchema = z.object({ query: listagemQuery });
export const mensagensIdSchema = z.object({ params: idParams });