import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export type Nivel = 'iniciante' | 'intermediario' | 'avancado' | 'profissional';

export interface CreateUsuarioEsporteInput {
  usuarioId: string; // vem como string (bigint)
  esporteId: number;
  nivel?: Nivel;
}

export interface UpdateUsuarioEsporteInput {
  nivel: Nivel;
}

type UsuarioEsporteRow = Awaited<ReturnType<typeof db.orm.public.UsuarioEsportes.create>>;

// A coluna é VarChar(20), que o ORM tipa como Varchar<20> e não como string comum
const toNivelColumn = (nivel: Nivel) => nivel as unknown as UsuarioEsporteRow['nivel'];

// bigint não serializa em JSON, então ids vão como string
export const toPublicUsuarioEsporte = (ue: UsuarioEsporteRow) => ({
  id: String(ue.id),
  usuarioId: String(ue.usuarioId),
  esporteId: ue.esporteId,
  nivel: ue.nivel,
});

async function garantirUsuario(usuarioId: bigint) {
  const usuario = await db.orm.public.Usuarios.first({ id: usuarioId });
  if (!usuario) throw new HttpError(404, 'Usuário não encontrado.');
}

async function garantirEsporte(esporteId: number) {
  const esporte = await db.orm.public.Esportes.first({ id: esporteId });
  if (!esporte) throw new HttpError(404, 'Esporte não encontrado.');
}

export async function createUsuarioEsporte(data: CreateUsuarioEsporteInput) {
  const usuarioId = BigInt(data.usuarioId);

  await garantirUsuario(usuarioId);
  await garantirEsporte(data.esporteId);

  // O banco também bloqueia (uq_usuario_esportes), mas assim devolvemos um erro claro
  const existente = await db.orm.public.UsuarioEsportes.first({
    usuarioId,
    esporteId: data.esporteId,
  });
  if (existente) throw new HttpError(409, 'Usuário já possui este esporte cadastrado.');

  return db.orm.public.UsuarioEsportes.create({
    usuarioId,
    esporteId: data.esporteId,
    nivel: toNivelColumn(data.nivel ?? 'iniciante'), // mesmo default do banco
  });
}

// Filtros opcionais
export async function getAllUsuarioEsportes(
  filtros: { usuarioId?: string; esporteId?: string } = {},
) {
  let lista = await db.orm.public.UsuarioEsportes.all();
  if (filtros.usuarioId) lista = lista.filter((ue) => String(ue.usuarioId) === filtros.usuarioId);
  if (filtros.esporteId) lista = lista.filter((ue) => String(ue.esporteId) === filtros.esporteId);
  return lista.sort((a, b) => Number(a.id) - Number(b.id));
}

export async function getUsuarioEsporteById(id: number) {
  const registro = await db.orm.public.UsuarioEsportes.first({ id: BigInt(id) });
  if (!registro) throw new HttpError(404, 'Registro não encontrado.');
  return registro;
}

export async function updateUsuarioEsporte(id: number, data: UpdateUsuarioEsporteInput) {
  const registro = await db.orm.public.UsuarioEsportes.where({ id: BigInt(id) }).update({
    nivel: toNivelColumn(data.nivel),
  });
  if (!registro) throw new HttpError(404, 'Registro não encontrado.');
  return registro;
}

export async function deleteUsuarioEsporte(id: number) {
  const registro = await db.orm.public.UsuarioEsportes.where({ id: BigInt(id) }).delete();
  if (!registro) throw new HttpError(404, 'Registro não encontrado.');
}