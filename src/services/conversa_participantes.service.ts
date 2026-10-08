import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export interface CreateConversaParticipantesInput {
  conversaId: bigint;
  usuarioId: bigint;
}

type ConversaParticipantesRow = Awaited<ReturnType<typeof db.orm.public.ConversaParticipantes.create>>;

export const toPublicConversaParticipantes = (participantes: ConversaParticipantesRow) => ({
  id: participantes.id.toString(),
  conversaId: participantes.conversaId.toString(),
  usuarioId: participantes.usuarioId.toString()
});

export async function createConversaParticipantes(data: CreateConversaParticipantesInput) {
  const [conversa, usuario] = await Promise.all([
    db.orm.public.Conversas.first({ id: data.conversaId }),
    db.orm.public.Usuarios.first({ id: data.usuarioId })
  ]);
  if (!conversa) throw new HttpError(404, 'Conversa não encontrada.');
  if (!usuario) throw new HttpError(404, 'Usuário não encontrado.');

  const existente = await db.orm.public.ConversaParticipantes.first({
    conversaId: data.conversaId,
    usuarioId: data.usuarioId
  });
  if (existente) throw new HttpError(409, 'Usuário já participa desta conversa.');

  return db.orm.public.ConversaParticipantes.create({
    conversaId: data.conversaId,
    usuarioId: data.usuarioId
  });
}

export async function getAllConversaParticipantes(
  limit = 20,
  offset = 0,
  conversaId?: bigint,
  usuarioId?: bigint
) {
  const take = Math.min(Math.max(limit, 1), 100);
  const skip = Math.max(offset, 0);

  const where: { conversaId?: bigint; usuarioId?: bigint } = {};
  if (conversaId !== undefined) where.conversaId = conversaId;
  if (usuarioId !== undefined) where.usuarioId = usuarioId;

  const colecao = (
    Object.keys(where).length === 0
      ? db.orm.public.ConversaParticipantes
      : db.orm.public.ConversaParticipantes.where(where as never)
  ) as unknown as typeof db.orm.public.ConversaParticipantes;

  const resultado: ConversaParticipantesRow[] = [];
  let indice = 0;

  for await (const participante of colecao.all()) {
    if (indice >= skip + take) break;
    if (indice >= skip) resultado.push(participante);
    indice++;
  }

  return resultado;
}

export async function getConversaParticipantesById(id: bigint) {
  const participantes = await db.orm.public.ConversaParticipantes.first({ id });
  if (!participantes) throw new HttpError(404, 'Participante não encontrado.');
  return participantes;
}

export async function deleteConversaParticipantes(id: bigint) {
  const participantes = await db.orm.public.ConversaParticipantes.where({ id }).delete();
  if (!participantes) throw new HttpError(404, 'Participante não encontrado.');
}