import { z } from 'zod';

const idNumerico = (campo: string) =>
  z.string().regex(/^\d+$/, `${campo} deve ser numérico.`);

const idFlexivel = (campo: string) =>
  z.union([z.string(), z.number().int().positive()])
    .transform(String)
    .pipe(idNumerico(campo));

export const createSeguidorSchema = z.object({
  body: z.object({ seguidoId: idFlexivel('seguidoId') }).strict(),
});

export const listSeguidoresSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    seguidorId: idNumerico('seguidorId').optional(),
    seguidoId: idNumerico('seguidoId').optional(),
  }),
});

export const seguidoresParamsSchema = z.object({
  params: z.object({
    seguidorId: idNumerico('seguidorId'),
    seguidoId: idNumerico('seguidoId'),
  }),
});
