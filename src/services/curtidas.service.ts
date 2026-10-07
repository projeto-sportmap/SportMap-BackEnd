import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export interface CreateCurtidaInput {
  publicacaoId: string; // vem como string (bigint)
  usuarioId: string;
}

type CurtidaRow = Awaited<ReturnType<typeof db.orm.public.Curtidas.create>>;

// bigint não serializa em JSON, então ids vão como string
export const toPublicCurtida = (c: CurtidaRow) => ({
  id: String(c.id),
  publicacaoId: String(c.publicacaoId),
  usuarioId: String(c.usuarioId),
  createdAt: c.createdAt,
});

async function garantirUsuario(usuarioId: bigint) {
  const usuario = await db.orm.public.Usuarios.first({ id: usuarioId });
  if (!usuario) throw new HttpError(404, 'Usuário não encontrado.');
}

async function garantirPublicacao(publicacaoId: bigint) {
  const publicacao = await db.orm.public.Publicacoes.first({ id: publicacaoId });
  if (!publicacao) throw new HttpError(404, 'Publicação não encontrada.');
}

export async function createCurtida(data: CreateCurtidaInput) {
  const publicacaoId = BigInt(data.publicacaoId);
  const usuarioId = BigInt(data.usuarioId);

  await garantirUsuario(usuarioId);
  await garantirPublicacao(publicacaoId);

  // O banco também bloqueia (uq_curtidas), mas assim devolvemos um erro claro
  const existente = await db.orm.public.Curtidas.first({ publicacaoId, usuarioId });
  if (existente) throw new HttpError(409, 'Usuário já curtiu esta publicação.');

  return db.orm.public.Curtidas.create({ publicacaoId, usuarioId });
}

// Filtros opcionais; mais recentes primeiro
export async function getAllCurtidas(filtros: { publicacaoId?: string; usuarioId?: string } = {}) {
  let lista = await db.orm.public.Curtidas.all();
  if (filtros.publicacaoId) lista = lista.filter((c) => String(c.publicacaoId) === filtros.publicacaoId);
  if (filtros.usuarioId) lista = lista.filter((c) => String(c.usuarioId) === filtros.usuarioId);
  return lista.sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime());
}

export async function getCurtidaById(id: number) {
  const curtida = await db.orm.public.Curtidas.first({ id: BigInt(id) });
  if (!curtida) throw new HttpError(404, 'Curtida não encontrada.');
  return curtida;
}

export async function deleteCurtida(id: number) {
  const curtida = await db.orm.public.Curtidas.where({ id: BigInt(id) }).delete();
  if (!curtida) throw new HttpError(404, 'Curtida não encontrada.');
}