import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export interface CreateSeguidoresInput {
  seguidorId: bigint;
  seguidoId: bigint;
}

type SeguidoresRow = Awaited<ReturnType<typeof db.orm.public.Seguidores.create>>;

export const toPublicSeguidores = (seguidores: SeguidoresRow) => ({
  seguidorId: seguidores.seguidorId.toString(),
  seguidoId: seguidores.seguidoId.toString()
});

export async function createSeguidores(data: CreateSeguidoresInput) {
  if (data.seguidorId === data.seguidoId) {
    throw new HttpError(400, 'Um usuário não pode seguir a si mesmo.');
  }

  const existente = await db.orm.public.Seguidores.first({
    seguidorId: data.seguidorId,
    seguidoId: data.seguidoId
  });
  if (existente) throw new HttpError(409, 'Você já segue este usuário.');

  return db.orm.public.Seguidores.create({
    seguidorId: data.seguidorId,
    seguidoId: data.seguidoId
  });
}

export async function getAllSeguidores(limit = 20, offset = 0) {
  const take = Math.min(Math.max(limit, 1), 100);
  const skip = Math.max(offset, 0);

  const resultado: SeguidoresRow[] = [];
  let indice = 0;

  for await (const seguidor of db.orm.public.Seguidores.all()) {
    if (indice >= skip + take) break;
    if (indice >= skip) resultado.push(seguidor);
    indice++;
  }

  return resultado;
}

export async function getSeguidor(seguidorId: bigint, seguidoId: bigint) {
  const seguidores = await db.orm.public.Seguidores.first({ seguidorId, seguidoId });
  if (!seguidores) throw new HttpError(404, 'Seguidor não encontrado.');
  return seguidores;
}

export async function deleteSeguidores(seguidorId: bigint, seguidoId: bigint) {
  const seguidores = await db.orm.public.Seguidores.where({ seguidorId, seguidoId }).delete();
  if (!seguidores) throw new HttpError(404, 'Seguidor não encontrado.');
}