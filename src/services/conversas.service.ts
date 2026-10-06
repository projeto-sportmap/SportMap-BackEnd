import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

type ConversasRow = Awaited<ReturnType<typeof db.orm.public.Conversas.create>>;

export const toPublicConversas = (conversas: ConversasRow) => ({
  id: conversas.id.toString(),
  createdAt: conversas.createdAt
});

export async function createConversas() {
  return db.orm.public.Conversas.create({});
}

export async function getAllConversas(limit = 20, offset = 0) {
  const take = Math.min(Math.max(limit, 1), 100);
  const skip = Math.max(offset, 0);

  const resultado: ConversasRow[] = [];
  let indice = 0;

  for await (const conversa of db.orm.public.Conversas.all()) {
    if (indice >= skip + take) break;
    if (indice >= skip) resultado.push(conversa);
    indice++;
  }

  return resultado;
}

export async function getConversasById(id: bigint) {
  const conversas = await db.orm.public.Conversas.first({ id });
  if (!conversas) throw new HttpError(404, 'Conversa não encontrada.');
  return conversas;
}

export async function deleteConversas(id: bigint) {
  const conversas = await db.orm.public.Conversas.where({ id }).delete();
  if (!conversas) throw new HttpError(404, 'Conversa não encontrada.');
}