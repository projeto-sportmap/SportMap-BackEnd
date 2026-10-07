import { z } from 'zod';

const MAX_BIGINT = 9223372036854775807n;
const MAX_INT = 2147483647;

export const CONDICOES = ['novo', 'seminovo', 'usado'] as const;
export const STATUS = ['ativo', 'pausado', 'vendido', 'removido'] as const;

const bigintId = (campo: string) =>
  z
    .string()
    .regex(/^\d+$/, `${campo} deve ser numérico.`)
    .refine(value => {
      const id = BigInt(value);
      return id >= 1n && id <= MAX_BIGINT;
    }, `${campo} fora do intervalo permitido.`);

const esporteId = z.coerce
  .number()
  .int('esporteId deve ser um inteiro.')
  .min(1, 'esporteId deve ser positivo.')
  .max(MAX_INT, 'esporteId fora do intervalo permitido.');

const titulo = z
  .string()
  .trim()
  .min(1, 'Título obrigatório.')
  .max(150, 'Título deve ter no máximo 150 caracteres.');

const descricao = z.string().trim().max(2000, 'Descrição deve ter no máximo 2000 caracteres.');

const cidade = z
  .string()
  .trim()
  .min(1, 'Cidade obrigatória.')
  .max(100, 'Cidade deve ter no máximo 100 caracteres.');

const preco = z
  .union([z.string(), z.number()])
  .transform(String)
  .pipe(z.string().regex(/^\d{1,8}(\.\d{1,2})?$/, 'Preço deve ser >= 0, com até 8 dígitos inteiros e 2 casas decimais.'));

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

const condicao = z.enum(CONDICOES);
const status = z.enum(STATUS);

const coordenadasJuntas = (value: { latitude?: unknown; longitude?: unknown }) => {
  const temLat = value.latitude !== undefined && value.latitude !== null;
  const temLng = value.longitude !== undefined && value.longitude !== null;
  return temLat === temLng;
};

const mensagemCoordenadas = {
  message: 'Latitude e longitude devem ser informadas juntas.',
  path: ['latitude'],
};

export const idParams = z.object({
  id: bigintId('id'),
});

export const listagemQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  esporteId: esporteId.optional(),
  cidade: cidade.optional(),
  status: status.optional(),
});

export const createAnunciosBody = z
  .object({
    titulo,
    descricao: descricao.nullable().optional(),
    preco,
    esporteId: esporteId.nullable().optional(),
    condicao,
    latitude: coordenada('Latitude', 90).nullable().optional(),
    longitude: coordenada('Longitude', 180).nullable().optional(),
    cidade: cidade.nullable().optional(),
  })
  .strict()
  .refine(coordenadasJuntas, mensagemCoordenadas);

export const updateAnunciosBody = z
  .object({
    titulo: titulo.optional(),
    descricao: descricao.nullable().optional(),
    preco: preco.optional(),
    esporteId: esporteId.nullable().optional(),
    condicao: condicao.optional(),
    status: status.optional(),
    latitude: coordenada('Latitude', 90).nullable().optional(),
    longitude: coordenada('Longitude', 180).nullable().optional(),
    cidade: cidade.nullable().optional(),
  })
  .strict()
  .refine(value => Object.keys(value).length > 0, 'Informe pelo menos um campo.')
  .refine(coordenadasJuntas, mensagemCoordenadas);

export const createAnunciosSchema = z.object({ body: createAnunciosBody });
export const updateAnunciosSchema = z.object({ body: updateAnunciosBody, params: idParams });
export const getAllAnunciosSchema = z.object({ query: listagemQuery });
export const anunciosIdSchema = z.object({ params: idParams });