import { z } from 'zod';

const MAX_BIGINT = 9223372036854775807n;
const MAX_INT = 2147483647;

export const STATUS_ATIVIDADE = [
  'aberta',
  'em_andamento',
  'concluida',
  'cancelada',
  'expirada',
] as const;

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

const esporteId = z.coerce
  .number()
  .int('esporteId deve ser um inteiro.')
  .min(1, 'esporteId deve ser positivo.')
  .max(MAX_INT, 'esporteId fora do intervalo permitido.');

const coordenada = (campo: string, limite: number) =>
  z
    .union([z.string(), z.number()])
    .transform(String)
    .pipe(
      z
        .string()
        .regex(/^-?\d+(\.\d{1,6})?$/, `${campo} deve ter até 6 casas decimais.`)
        .refine(value => Math.abs(Number(value)) <= limite, `${campo} deve estar entre -${limite} e ${limite}.`),
    );

const descricao = z.string().trim().max(500, 'Descrição deve ter no máximo 500 caracteres.');

const data = z.coerce.date();

const status = z.enum(STATUS_ATIVIDADE);

export const idParams = z.object({
  id: bigintId('id'),
});

export const listagemQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  esporteId: esporteId.optional(),
  status: status.optional(),
});

export const createAtividadesBody = z
  .object({
    // Provisório: enquanto não houver middleware de autenticação, vem do body.
    // Depois, remova este campo e use o id do token.
    usuarioId: bigintIdFlex('usuarioId'),
    esporteId,
    descricao: descricao.nullable().optional(),
    latitude: coordenada('Latitude', 90),
    longitude: coordenada('Longitude', 180),
    expiraEm: data.refine(value => value.getTime() > Date.now(), 'A data de expiração deve ser futura.'),
  })
  .strict();

export const updateAtividadesBody = z
  .object({
    descricao: descricao.nullable().optional(),
    status: status.optional(),
    expiraEm: data
      .refine(value => value.getTime() > Date.now(), 'A data de expiração deve ser futura.')
      .optional(),
  })
  .strict()
  .refine(value => Object.keys(value).length > 0, 'Informe pelo menos um campo.');

export const createAtividadesSchema = z.object({ body: createAtividadesBody });
export const updateAtividadesSchema = z.object({ body: updateAtividadesBody, params: idParams });
export const getAllAtividadesSchema = z.object({ query: listagemQuery });
export const atividadesIdSchema = z.object({ params: idParams });