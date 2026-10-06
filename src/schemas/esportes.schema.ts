import { z } from 'zod';

export const idParams = z.object({
  id: z.string().regex(/^\d+$/, 'ID deve ser numérico.').refine(value => {
    const id = Number(value);
    return Number.isSafeInteger(id) && id >= 1 && id <= 2147483647;
  }, 'ID fora do intervalo permitido.'),
});


export const createEsporteBody = z.object({
  nome: z.string().trim().min(2).max(100).optional(),
}).strict();

export const updateEsporteBody = createEsporteBody.partial().refine(
  value => Object.keys(value).length > 0,
  'Informe pelo menos um campo.',
);

export const createEsporteSchema = z.object({ body: createEsporteBody });
export const updateEsporteSchema = z.object({ body: updateEsporteBody, params: idParams });
export const esporteIdSchema = z.object({ params: idParams });