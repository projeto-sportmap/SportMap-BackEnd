import { z } from 'zod';

const idNumerico = (campo: string) =>
  z.string().refine((v) => /^\d+$/.test(v), { message: `${campo} deve ser numérico.` });

const idParams = z.object({ id: idNumerico('O ID') });

const esporteIdBody = z
  .number('esporteId deve ser um número.')
  .int('esporteId deve ser inteiro.')
  .min(1, 'esporteId inválido.')
  .max(2147483647, 'esporteId inválido.');

const conteudo = z
  .string()
  .trim()
  .max(5000, 'O conteúdo deve ter no máximo 5000 caracteres.')
  .transform((v) => (v === '' ? null : v));

const latitude = z.number('Latitude deve ser um número.').min(-90, 'Latitude mínima: -90.').max(90, 'Latitude máxima: 90.');
const longitude = z.number('Longitude deve ser um número.').min(-180, 'Longitude mínima: -180.').max(180, 'Longitude máxima: 180.');

// Regra do banco (ck_publicacoes_coord): latitude e longitude vêm juntas ou nenhuma
const coordenadasJuntas = (b: { latitude?: number | null; longitude?: number | null }) =>
  (b.latitude == null) === (b.longitude == null);
const msgCoordenadas = { message: 'Informe latitude e longitude juntas.', path: ['latitude'] };

export const createPublicacaoSchema = z.object({
  body: z
    .object({
      esporteId: esporteIdBody.nullish(),
      conteudo: conteudo.nullish(),
      latitude: latitude.nullish(),
      longitude: longitude.nullish(),
    })
    .refine(coordenadasJuntas, msgCoordenadas),
});

export const updatePublicacaoSchema = z.object({
  body: z
    .object({
      esporteId: esporteIdBody.nullish(),
      conteudo: conteudo.nullish(),
      latitude: latitude.nullish(),
      longitude: longitude.nullish(),
    })
    .refine(coordenadasJuntas, msgCoordenadas)
    .refine((b) => Object.keys(b).length > 0, { message: 'Informe pelo menos um campo.' }),
  params: idParams,
});

export const publicacaoIdSchema = z.object({
  params: idParams,
});

export const listPublicacoesSchema = z.object({
  query: z.object({
    usuarioId: idNumerico('usuarioId').optional(),
    esporteId: idNumerico('esporteId').optional(),
  }),
});
