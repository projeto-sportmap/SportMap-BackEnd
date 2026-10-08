import { z } from 'zod';

const idNumerico = (campo: string) =>
  z.string().refine((v) => /^\d+$/.test(v), { message: `${campo} deve ser numérico.` });

const idParams = z.object({ id: idNumerico('O ID') });

// Mesmos valores do ck_publicacao_midias_tipo
const TIPOS = ['imagem', 'video'] as const;
const tipo = z.enum(TIPOS, {
  error: `tipo deve ser um destes: ${TIPOS.join(', ')}.`,
});

const url = z
  .string('url deve ser um texto.')
  .trim()
  .max(500, 'A url deve ter no máximo 500 caracteres.')
  .refine((v) => /^https?:\/\/\S+$/i.test(v), { message: 'url deve começar com http:// ou https://.' });

// SmallInt no banco: 0 a 32767
const ordem = z
  .number('ordem deve ser um número.')
  .int('ordem deve ser inteira.')
  .min(0, 'ordem mínima: 0.')
  .max(32767, 'ordem máxima: 32767.');

// publicacaoId pode chegar como número ou string; vira string para o service converter em BigInt
const publicacaoIdBody = z
  .union([z.number().int().positive(), idNumerico('O publicacaoId')], { error: 'publicacaoId inválido.' })
  .transform((v) => String(v));

export const createPublicacaoMidiaSchema = z.object({
  body: z.object({
    publicacaoId: publicacaoIdBody,
    tipo,
    url,
    ordem: ordem.optional(), // se omitida, o service usa a próxima posição livre
  }),
});

// publicacaoId não pode ser alterado depois de criada
export const updatePublicacaoMidiaSchema = z.object({
  body: z
    .object({
      tipo: tipo.optional(),
      url: url.optional(),
      ordem: ordem.optional(),
    })
    .refine((b) => Object.keys(b).length > 0, { message: 'Informe pelo menos um campo.' }),
  params: idParams,
});

export const publicacaoMidiaIdSchema = z.object({
  params: idParams,
});

// GET /publicacao-midias?publicacaoId=1
export const listPublicacaoMidiasSchema = z.object({
  query: z.object({
    publicacaoId: idNumerico('publicacaoId').optional(),
  }),
});