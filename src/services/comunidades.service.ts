import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export interface CreateComunidadeInput {
  nome: string;
  bio?: string | null;
  fotoUrl?: string | null;
  esporteId?: number | null;
}

export type UpdateComunidadeInput = Partial<CreateComunidadeInput>;

type ComunidadeRow = Awaited<ReturnType<typeof db.orm.public.Comunidades.create>>;
type ComunidadeChanges = Partial<Omit<ComunidadeRow, 'id' | 'criadorId' | 'createdAt'>>;

const toBigInt = (id: number | string) => BigInt(id);

export const toPublicComunidade = (c: ComunidadeRow) => ({
  id: String(c.id),
  criadorId: String(c.criadorId),
  esporteId: c.esporteId,
  nome: c.nome,
  bio: c.bio,
  fotoUrl: c.fotoUrl,
  createdAt: c.createdAt,
  updatedAt: c.updatedAt,
});

async function garantirNomeUnico(criadorId: number, nome: string, idAtual?: number) {
  const existente = await db.orm.public.Comunidades.first({
    criadorId: toBigInt(criadorId),
    nome: nome as ComunidadeRow['nome'],
  });

  if (existente && existente.id !== (idAtual === undefined ? undefined : toBigInt(idAtual))) {
    throw new HttpError(409, 'Você já possui uma comunidade com esse nome.');
  }
}

export async function getComunidadeById(id: number) {
  const comunidade = await db.orm.public.Comunidades.first({ id: toBigInt(id) });
  if (!comunidade) throw new HttpError(404, 'Comunidade não encontrada.');
  return comunidade;
}

/** Garante que a comunidade existe e que o usuário é o criador. */
async function assertCriador(id: number, usuarioId: number) {
  const comunidade = await getComunidadeById(id);

  if (comunidade.criadorId !== toBigInt(usuarioId)) {
    throw new HttpError(403, 'Apenas o criador pode alterar esta comunidade.');
  }

  return comunidade;
}

export async function getAllComunidades() {
  return db.orm.public.Comunidades.all();
}

export async function createComunidade(criadorId: number, data: CreateComunidadeInput) {
  await garantirNomeUnico(criadorId, data.nome);

  const comunidade = await db.orm.public.Comunidades.create({
    criadorId: toBigInt(criadorId) as ComunidadeRow['criadorId'],
    nome: data.nome as ComunidadeRow['nome'],
    bio: (data.bio ?? null) as ComunidadeRow['bio'],
    fotoUrl: (data.fotoUrl ?? null) as ComunidadeRow['fotoUrl'],
    esporteId: (data.esporteId ?? null) as ComunidadeRow['esporteId'],
  });

  // O criador entra automaticamente como admin da comunidade
  await db.orm.public.ComunidadeParticipantes.create({
    comunidadeId: comunidade.id as unknown as bigint,
    usuarioId: toBigInt(criadorId) as unknown as bigint,
    papel: 'admin',
  });

  return comunidade;
}

export async function updateComunidade(id: number, usuarioId: number, data: UpdateComunidadeInput) {
  await assertCriador(id, usuarioId);

  if (data.nome !== undefined) {
    await garantirNomeUnico(usuarioId, data.nome, id);
  }

  const changes: ComunidadeChanges = {};
  if (data.nome !== undefined) changes.nome = data.nome as ComunidadeRow['nome'];
  if (data.bio !== undefined) changes.bio = data.bio as ComunidadeRow['bio'];
  if (data.fotoUrl !== undefined) changes.fotoUrl = data.fotoUrl as ComunidadeRow['fotoUrl'];
  if (data.esporteId !== undefined) changes.esporteId = data.esporteId as ComunidadeRow['esporteId'];

  if (Object.keys(changes).length === 0) throw new HttpError(400, 'Informe pelo menos um campo.');

  changes.updatedAt = new Date() as ComunidadeRow['updatedAt'];

  const comunidade = await db.orm.public.Comunidades.where({ id: toBigInt(id) }).update(changes);
  if (!comunidade) throw new HttpError(404, 'Comunidade não encontrada.');

  return comunidade;
}

export async function deleteComunidade(id: number, usuarioId: number) {
  await assertCriador(id, usuarioId);
  await db.orm.public.Comunidades.where({ id: toBigInt(id) }).delete();
}

export async function participarComunidade(comunidadeId: number, usuarioId: number) {
  await getComunidadeById(comunidadeId);

  const existente = await db.orm.public.ComunidadeParticipantes.first({
    comunidadeId: toBigInt(comunidadeId),
    usuarioId: toBigInt(usuarioId),
  });

  if (existente) throw new HttpError(409, 'Você já participa desta comunidade.');

  return db.orm.public.ComunidadeParticipantes.create({
    comunidadeId: toBigInt(comunidadeId) as unknown as bigint,
    usuarioId: toBigInt(usuarioId) as unknown as bigint,
    papel: 'membro',
  });
}

export async function sairComunidade(comunidadeId: number, usuarioId: number) {
  const comunidade = await getComunidadeById(comunidadeId);

  if (comunidade.criadorId === toBigInt(usuarioId)) {
    throw new HttpError(400, 'O criador não pode sair da própria comunidade.');
  }

  const participacao = await db.orm.public.ComunidadeParticipantes.first({
    comunidadeId: toBigInt(comunidadeId),
    usuarioId: toBigInt(usuarioId),
  });

  if (!participacao) throw new HttpError(404, 'Você não participa desta comunidade.');

  await db.orm.public.ComunidadeParticipantes.where({ id: participacao.id }).delete();
}