import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export interface CreateMensagensInput {
  conversaId: bigint;
  remetenteId: bigint;
  conteudo: string;
}

type MensagensRow = Awaited<ReturnType<typeof db.orm.public.Mensagens.create>>;

export const toPublicMensagens = (mensagens: MensagensRow) => ({
  id: mensagens.id.toString(),
  conversaId: mensagens.conversaId.toString(),
  remetenteId: mensagens.remetenteId.toString(),
  conteudo: mensagens.conteudo,
  lida: mensagens.lida,
  createdAt: mensagens.createdAt
});

export async function createMensagens(data: CreateMensagensInput) {
  const conteudo = data.conteudo.trim();
  if (!conteudo) throw new HttpError(400, 'Conteúdo da mensagem não pode ser vazio.');

  const [conversa, remetente] = await Promise.all([
    db.orm.public.Conversas.first({ id: data.conversaId }),
    db.orm.public.Usuarios.first({ id: data.remetenteId })
  ]);
  if (!conversa) throw new HttpError(404, 'Conversa não encontrada.');
  if (!remetente) throw new HttpError(404, 'Usuário remetente não encontrado.');

  return db.orm.public.Mensagens.create({
    conversaId: data.conversaId,
    remetenteId: data.remetenteId,
    conteudo,
    lida: false
  } as never);
}

export async function getAllMensagens(limit = 20, offset = 0, conversaId?: bigint) {
  const take = Math.min(Math.max(limit, 1), 100);
  const skip = Math.max(offset, 0);

  const colecao = (
    conversaId === undefined
      ? db.orm.public.Mensagens
      : db.orm.public.Mensagens.where({ conversaId })
  ) as unknown as typeof db.orm.public.Mensagens;

  const resultado: MensagensRow[] = [];
  let indice = 0;

  for await (const mensagem of colecao.all()) {
    if (indice >= skip + take) break;
    if (indice >= skip) resultado.push(mensagem);
    indice++;
  }

  return resultado;
}

export async function getMensagensById(id: bigint) {
  const mensagens = await db.orm.public.Mensagens.first({ id });
  if (!mensagens) throw new HttpError(404, 'Mensagem não encontrada.');
  return mensagens;
}

export async function marcarComoLida(id: bigint) {
  await getMensagensById(id);
  const mensagens = await db.orm.public.Mensagens.where({ id }).update({ lida: true } as never);
  if (!mensagens) throw new HttpError(404, 'Mensagem não encontrada.');
  return mensagens;
}

export async function deleteMensagens(id: bigint) {
  const mensagens = await db.orm.public.Mensagens.where({ id }).delete();
  if (!mensagens) throw new HttpError(404, 'Mensagem não encontrada.');
}