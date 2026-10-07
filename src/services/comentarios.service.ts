// Arquivo: src/services/comentarios.service.ts
import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';
import type {
  CreateComentarioInput,
  UpdateComentarioInput,
} from '../schemas/comentarios.schema.js';

type ComentarioRow = Awaited<ReturnType<typeof db.orm.public.Comentarios.create>>;

export const toPublicComentario = (comentario: ComentarioRow) => ({
  id: comentario.id.toString(),
  publicacaoId: comentario.publicacaoId.toString(),
  usuarioId: comentario.usuarioId.toString(),
  conteudo: comentario.conteudo,
  createdAt: comentario.createdAt,
});

function toBigInt(value: string | bigint): bigint {
  try {
    return BigInt(value);
  } catch {
    throw new HttpError(400, 'ID inválido.');
  }
}

export async function createComentario(
  publicacaoId: string,
  usuarioId: string | bigint,
  data: CreateComentarioInput,
) {
  const pubId = toBigInt(publicacaoId);

  const publicacao = await db.orm.public.Publicacoes.first({ id: pubId });
  if (!publicacao) throw new HttpError(404, 'Publicação não encontrada.');

  const comentario = await db.orm.public.Comentarios.create({
    publicacaoId: pubId,
    usuarioId: toBigInt(usuarioId),
    conteudo: data.conteudo,
  });
  return toPublicComentario(comentario);
}

export async function getComentariosByPublicacao(publicacaoId: string) {
  const comentarios = await db.orm.public.Comentarios
    .where({ publicacaoId: toBigInt(publicacaoId) })
    .all();
  return comentarios.map(toPublicComentario);
}

export async function getComentarioById(id: string) {
  const comentario = await db.orm.public.Comentarios.first({ id: toBigInt(id) });
  if (!comentario) throw new HttpError(404, 'Comentário não encontrado.');
  return toPublicComentario(comentario);
}

export async function updateComentario(
  id: string,
  usuarioId: string | bigint,
  data: UpdateComentarioInput,
) {
  const comentarioId = toBigInt(id);

  const existente = await db.orm.public.Comentarios.first({ id: comentarioId });
  if (!existente) throw new HttpError(404, 'Comentário não encontrado.');
  if (existente.usuarioId !== toBigInt(usuarioId)) {
    throw new HttpError(403, 'Você não pode editar este comentário.');
  }

  const atualizado = await db.orm.public.Comentarios
    .where({ id: comentarioId })
    .update({ conteudo: data.conteudo });
  if (!atualizado) throw new HttpError(404, 'Comentário não encontrado.');
  return toPublicComentario(atualizado);
}

export async function deleteComentario(id: string, usuarioId: string | bigint) {
  const comentarioId = toBigInt(id);

  const existente = await db.orm.public.Comentarios.first({ id: comentarioId });
  if (!existente) throw new HttpError(404, 'Comentário não encontrado.');
  if (existente.usuarioId !== toBigInt(usuarioId)) {
    throw new HttpError(403, 'Você não pode apagar este comentário.');
  }

  await db.orm.public.Comentarios.where({ id: comentarioId }).delete();
}