import { z } from 'zod';

const MAX_BIGINT = 9223372036854775807n;
const MAX_SMALLINT = 32767;

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

const url = z
  .string()
  .trim()
  .min(1, 'URL obrigatória.')
  .max(500, 'URL deve ter no máximo 500 caracteres.')
  .url('URL inválida.');

const ordem = z.coerce
  .number()
  .int('Ordem deve ser um inteiro.')
  .min(0, 'Ordem não pode ser negativa.')
  .max(MAX_SMALLINT, `Ordem deve ser no máximo ${MAX_SMALLINT}.`);

export const idParams = z.object({
  id: bigintId('id'),
});

export const listagemQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  anuncioId: bigintId('anuncioId').optional(),
});

export const createAnuncioMidiasBody = z
  .object({
    anuncioId: bigintIdFlex('anuncioId'),
    url,
    ordem: ordem.optional(),
  })
  .strict();

export const updateAnuncioMidiasBody = z
  .object({
    url: url.optional(),
    ordem: ordem.optional(),
  })
  .strict()
  .refine(value => Object.keys(value).length > 0, 'Informe pelo menos um campo.');

export const createAnuncioMidiasSchema = z.object({ body: createAnuncioMidiasBody });
export const updateAnuncioMidiasSchema = z.object({ body: updateAnuncioMidiasBody, params: idParams });
export const getAllAnuncioMidiasSchema = z.object({ query: listagemQuery });
export const anuncioMidiasIdSchema = z.object({ params: idParams });