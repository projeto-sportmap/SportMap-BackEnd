import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export interface CreatePublicacaoInput {
  usuarioId: string; // vem como string (bigint)
  esporteId?: number | null;
  conteudo?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export type UpdatePublicacaoInput = Partial<Omit<CreatePublicacaoInput, 'usuarioId'>>;
type PublicacaoRow = Awaited<ReturnType<typeof db.orm.public.Publicacoes.create>>;
type PublicacaoChanges = Partial<Omit<PublicacaoRow, 'id' | 'usuarioId' | 'createdAt'>>;

const num = (valor: unknown) => (valor === null || valor === undefined ? null : Number(valor));

// bigint não serializa em JSON, então ids vão como string
export const toPublicPublicacao = (p: PublicacaoRow) => ({
  id: String(p.id),
  usuarioId: String(p.usuarioId),
  esporteId: p.esporteId,
  conteudo: p.conteudo,
  latitude: num(p.latitude),
  longitude: num(p.longitude),
  createdAt: p.createdAt,
});

async function garantirUsuario(usuarioId: bigint) {
  const usuario = await db.orm.public.Usuarios.first({ id: usuarioId });
  if (!usuario) throw new HttpError(404, 'Usuário não encontrado.');
}

async function garantirEsporte(esporteId: number) {
  const esporte = await db.orm.public.Esportes.first({ id: esporteId });
  if (!esporte) throw new HttpError(404, 'Esporte não encontrado.');
}

export async function createPublicacao(data: CreatePublicacaoInput) {
  const usuarioId = BigInt(data.usuarioId);
  await garantirUsuario(usuarioId);
  if (data.esporteId != null) await garantirEsporte(data.esporteId);

  return db.orm.public.Publicacoes.create({
    usuarioId,
    esporteId: data.esporteId ?? null,
    conteudo: data.conteudo ?? null,
    latitude: (data.latitude ?? null) as unknown as PublicacaoRow['latitude'],
    longitude: (data.longitude ?? null) as unknown as PublicacaoRow['longitude'],
  });
}

// Filtros opcionais; mais recentes primeiro
export async function getAllPublicacoes(filtros: { usuarioId?: string; esporteId?: string } = {}) {
  let lista = await db.orm.public.Publicacoes.all();
  if (filtros.usuarioId) lista = lista.filter((p) => String(p.usuarioId) === filtros.usuarioId);
  if (filtros.esporteId) lista = lista.filter((p) => String(p.esporteId) === filtros.esporteId);
  return lista.sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime());
}

export async function getPublicacaoById(id: number) {
  const publicacao = await db.orm.public.Publicacoes.first({ id: BigInt(id) });
  if (!publicacao) throw new HttpError(404, 'Publicação não encontrada.');
  return publicacao;
}

export async function updatePublicacao(id: number, data: UpdatePublicacaoInput) {
  const changes: PublicacaoChanges = {};
  if (data.esporteId !== undefined) {
    if (data.esporteId !== null) await garantirEsporte(data.esporteId);
    changes.esporteId = data.esporteId;
  }
  if (data.conteudo !== undefined) changes.conteudo = data.conteudo;
  if (data.latitude !== undefined) changes.latitude = data.latitude as unknown as PublicacaoRow['latitude'];
  if (data.longitude !== undefined) changes.longitude = data.longitude as unknown as PublicacaoRow['longitude'];

  if (Object.keys(changes).length === 0) throw new HttpError(400, 'Informe pelo menos um campo.');
  const publicacao = await db.orm.public.Publicacoes.where({ id: BigInt(id) }).update(changes);
  if (!publicacao) throw new HttpError(404, 'Publicação não encontrada.');
  return publicacao;
}

export async function deletePublicacao(id: number) {
  const publicacao = await db.orm.public.Publicacoes.where({ id: BigInt(id) }).delete();
  if (!publicacao) throw new HttpError(404, 'Publicação não encontrada.');
}