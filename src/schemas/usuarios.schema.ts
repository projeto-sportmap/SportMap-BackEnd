import { z } from 'zod';

const textoOpcional = (max: number) =>
  z.string().trim().max(max, `Deve ter no máximo ${max} caracteres.`).nullish();

const baseBody = z.object({
  nome: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres.').max(100, 'O nome deve ter no máximo 100 caracteres.'),
  sobrenome: z.string().trim().min(2, 'O sobrenome deve ter pelo menos 2 caracteres.').max(100, 'O sobrenome deve ter no máximo 100 caracteres.'),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'O username deve ter pelo menos 3 caracteres.')
    .max(30, 'O username deve ter no máximo 30 caracteres.')
    .regex(/^[a-z0-9_.]+$/, 'O username só pode ter letras, números, "_" e ".".'),
  email: z.string().trim().toLowerCase().max(255, 'O e-mail deve ter no máximo 255 caracteres.').pipe(z.email('Formato de e-mail inválido.')),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.').max(72, 'A senha deve ter no máximo 72 caracteres.'),
  fotoPerfilUrl: textoOpcional(500),
  cidade: textoOpcional(100),
  bio: textoOpcional(1000),
  latitude: z.number('Latitude deve ser um número.').min(-90, 'Latitude mínima: -90.').max(90, 'Latitude máxima: 90.').nullish(),
  longitude: z.number('Longitude deve ser um número.').min(-180, 'Longitude mínima: -180.').max(180, 'Longitude máxima: 180.').nullish(),
});

const coordenadasJuntas = (b: { latitude?: number | null; longitude?: number | null }) =>
  (b.latitude == null) === (b.longitude == null);
const msgCoordenadas = { message: 'Informe latitude e longitude juntas.', path: ['latitude'] };

const idParams = z.object({
  id: z.string().refine((val) => /^\d+$/.test(val), { message: 'O ID deve ser numérico.' }),
});

export const createUsuarioSchema = z.object({
  body: baseBody.refine(coordenadasJuntas, msgCoordenadas),
});

export const updateUsuarioSchema = z.object({
  body: baseBody
    .partial()
    .refine(coordenadasJuntas, msgCoordenadas)
    .refine((b) => Object.keys(b).length > 0, { message: 'Informe pelo menos um campo.' }),
  params: idParams,
});

export const usuarioIdSchema = z.object({
  params: idParams,
});
export const localizacaoSchema = z.object({
  body: z.object({
    latitude: z.number('Latitude deve ser um número.').min(-90, 'Latitude mínima: -90.').max(90, 'Latitude máxima: 90.'),
    longitude: z.number('Longitude deve ser um número.').min(-180, 'Longitude mínima: -180.').max(180, 'Longitude máxima: 180.'),
  }),
  params: usuarioIdSchema.shape.params,
});