import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export interface CreateAnuncioMidiasInput {
  anuncioId: bigint;
  url: string;
  ordem?: number;
}

export interface UpdateAnuncioMidiasInput {
  url?: string;
  ordem?: number;
}

type AnuncioMidiasRow = Awaited<ReturnType<typeof db.orm.public.AnuncioMidias.create>>;

export const toPublicAnuncioMidias = (midias: AnuncioMidiasRow) => ({
  id: midias.id.toString(),
  anuncioId: midias.anuncioId.toString(),
  url: String(midias.url),
  ordem: Number(midias.ordem)
});

async function garantirAnuncio(anuncioId: bigint) {
  const anuncio = await db.orm.public.Anuncios.first({ id: anuncioId });
  if (!anuncio || String(anuncio.status) === 'removido') {
    throw new HttpError(404, 'Anúncio não encontrado.');
  }
}

async function garantirOrdemLivre(anuncioId: bigint, ordem: number, ignorarId?: bigint) {
  const existente = await db.orm.public.AnuncioMidias.first({ anuncioId, ordem } as never);
  if (existente && existente.id !== ignorarId) {
    throw new HttpError(409, 'Já existe uma mídia com essa ordem neste anúncio.');
  }
}

export async function createAnuncioMidias(data: CreateAnuncioMidiasInput) {
  const ordem = data.ordem ?? 0;

  await garantirAnuncio(data.anuncioId);
  await garantirOrdemLivre(data.anuncioId, ordem);

  return db.orm.public.AnuncioMidias.create({
    anuncioId: data.anuncioId,
    url: data.url,
    ordem
  } as never);
}

export async function getAllAnuncioMidias(limit = 20, offset = 0, anuncioId?: bigint) {
  const take = Math.min(Math.max(limit, 1), 100);
  const skip = Math.max(offset, 0);

  const colecao = (
    anuncioId === undefined
      ? db.orm.public.AnuncioMidias
      : db.orm.public.AnuncioMidias.where({ anuncioId })
  ) as unknown as typeof db.orm.public.AnuncioMidias;

  const resultado: AnuncioMidiasRow[] = [];
  let indice = 0;

  for await (const midia of colecao.all()) {
    if (indice >= skip + take) break;
    if (indice >= skip) resultado.push(midia);
    indice++;
  }

  return resultado;
}

export async function getAnuncioMidiasById(id: bigint) {
  const midias = await db.orm.public.AnuncioMidias.first({ id });
  if (!midias) throw new HttpError(404, 'Mídia não encontrada.');
  return midias;
}

export async function updateAnuncioMidias(id: bigint, data: UpdateAnuncioMidiasInput) {
  const changes: UpdateAnuncioMidiasInput = {};
  if (data.url !== undefined) changes.url = data.url;
  if (data.ordem !== undefined) changes.ordem = data.ordem;
  if (Object.keys(changes).length === 0) throw new HttpError(400, 'Informe pelo menos um campo.');

  const atual = await getAnuncioMidiasById(id);
  if (changes.ordem !== undefined) {
    await garantirOrdemLivre(atual.anuncioId, changes.ordem, id);
  }

  const midias = await db.orm.public.AnuncioMidias.where({ id }).update(changes as never);
  if (!midias) throw new HttpError(404, 'Mídia não encontrada.');
  return midias;
}

export async function deleteAnuncioMidias(id: bigint) {
  const midias = await db.orm.public.AnuncioMidias.where({ id }).delete();
  if (!midias) throw new HttpError(404, 'Mídia não encontrada.');
}