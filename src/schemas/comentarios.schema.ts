import { z } from 'zod';

const idParam = z.string().regex(/^\d+$/, 'ID inválido.');

export const createComentario = z
  .object({
    conteudo: z
      .string()
      .trim()
      .min(1, 'Informe o conteúdo do comentário.')
      .max(300, 'O comentário pode ter no máximo 300 caracteres.'),
  })
  .strict();

export const updateComentario = createComentario;

export const createComentarioSchema = z.object({
  params: z.object({ publicacaoId: idParam }),
  body: createComentario,
});

export const updateComentarioSchema = z.object({
  params: z.object({ id: idParam }),
  body: updateComentario,
});

export type CreateComentarioInput = z.output<typeof createComentario>;
export type UpdateComentarioInput = z.output<typeof updateComentario>;