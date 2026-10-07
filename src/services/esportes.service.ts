import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export interface CreateEsporteInput {
  nome: string;
}

export type UpdateEsporteInput = Partial<CreateEsporteInput>;
type EsporteRow = Awaited<ReturnType<typeof db.orm.public.Esportes.create>>;

export const toPublicEsporte = (esporte: EsporteRow) => ({
  nome: esporte.nome,
});

export async function createEsporte(data: CreateEsporteInput) {
  return db.orm.public.Esportes.create({
    nome: data.nome,
  });
}

export async function getAllEsportes() {
  return db.orm.public.Esportes.all();
}

export async function getEsporteById(id: number) {
  const esporte = await db.orm.public.Esportes.first({ id });
  if (!esporte) throw new HttpError(404, 'Esporte não encontrado.');
  return esporte;
}

export async function updateEsporte(id: number, data: UpdateEsporteInput) {
  const changes: UpdateEsporteInput = {};
  if (data.nome !== undefined) changes.nome = data.nome;
  if (Object.keys(changes).length === 0) throw new HttpError(400, 'Informe pelo menos um campo.');
  const esporte = await db.orm.public.Esportes.where({ id }).update(changes);
  if (!esporte) throw new HttpError(404, 'Esporte não encontrado.');
  return esporte;
}

export async function deleteEsporte(id: number) {
  const esporte = await db.orm.public.Esportes.where({ id }).delete();
  if (!esporte) throw new HttpError(404, 'Esporte não encontrado.');
}