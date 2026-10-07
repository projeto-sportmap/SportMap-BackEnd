import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export const STATUS_ATIVIDADE = [
  'aberta',
  'em_andamento',
  'concluida',
  'cancelada',
  'expirada'
] as const;

export type StatusAtividade = (typeof STATUS_ATIVIDADE)[number];

export interface CreateAtividadesInput {
  usuarioId: bigint;
  esporteId: number;
  descricao?: string | null;
  latitude: string;
  longitude: string;
  expiraEm: Date;
}

export interface UpdateAtividadesInput {
  descricao?: string | null;
  status?: StatusAtividade;
  expiraEm?: Date;
}

export interface FiltrosAtividades {
  esporteId?: number;
  status?: StatusAtividade;
  limit?: number;
  offset?: number;
}

type AtividadesRow = Awaited<ReturnType<typeof db.orm.public.Atividades.create>>;

export const toPublicAtividades = (atividades: AtividadesRow) => ({
  id: atividades.id.toString(),
  usuarioId: atividades.usuarioId.toString(),
  esporteId: atividades.esporteId,
  descricao: atividades.descricao,
  latitude: String(atividades.latitude),
  longitude: String(atividades.longitude),
  status: atividades.status,
  createdAt: atividades.createdAt,
  expiraEm: atividades.expiraEm
});

export async function createAtividades(data: CreateAtividadesInput) {
  if (data.expiraEm.getTime() <= Date.now()) {
    throw new HttpError(400, 'A data de expiração deve ser futura.');
  }

  const [usuario, esporte] = await Promise.all([
    db.orm.public.Usuarios.first({ id: data.usuarioId }),
    db.orm.public.Esportes.first({ id: data.esporteId })
  ]);
  if (!usuario) throw new HttpError(404, 'Usuário não encontrado.');
  if (!esporte) throw new HttpError(404, 'Esporte não encontrado.');

  return db.orm.public.Atividades.create({
    usuarioId: data.usuarioId,
    esporteId: data.esporteId,
    descricao: data.descricao ?? null,
    latitude: data.latitude,
    longitude: data.longitude,
    status: 'aberta',
    expiraEm: data.expiraEm
  } as never);
}

export async function getAllAtividades(filtros: FiltrosAtividades = {}) {
  const take = Math.min(Math.max(filtros.limit ?? 20, 1), 100);
  const skip = Math.max(filtros.offset ?? 0, 0);

  const where: { status: StatusAtividade; esporteId?: number } = {
    status: filtros.status ?? 'aberta'
  };
  if (filtros.esporteId !== undefined) where.esporteId = filtros.esporteId;

  const resultado: AtividadesRow[] = [];
  let indice = 0;

  for await (const atividade of db.orm.public.Atividades.where(where as never).all()) {
    if (indice >= skip + take) break;
    if (indice >= skip) resultado.push(atividade);
    indice++;
  }

  return resultado;
}

export async function getAtividadesById(id: bigint) {
  const atividades = await db.orm.public.Atividades.first({ id });
  if (!atividades) throw new HttpError(404, 'Atividade não encontrada.');
  return atividades;
}

export async function updateAtividades(id: bigint, data: UpdateAtividadesInput) {
  const changes: UpdateAtividadesInput = {};
  if (data.descricao !== undefined) changes.descricao = data.descricao;
  if (data.status !== undefined) changes.status = data.status;
  if (data.expiraEm !== undefined) {
    if (data.expiraEm.getTime() <= Date.now()) {
      throw new HttpError(400, 'A data de expiração deve ser futura.');
    }
    changes.expiraEm = data.expiraEm;
  }

  if (Object.keys(changes).length === 0) throw new HttpError(400, 'Informe pelo menos um campo.');

  await getAtividadesById(id);

  const atividades = await db.orm.public.Atividades.where({ id }).update(changes as never);
  if (!atividades) throw new HttpError(404, 'Atividade não encontrada.');
  return atividades;
}

// Cancelamento lógico: preserva o histórico da atividade.
export async function cancelarAtividades(id: bigint) {
  await getAtividadesById(id);
  const atividades = await db.orm.public.Atividades.where({ id }).update({ status: 'cancelada' } as never);
  if (!atividades) throw new HttpError(404, 'Atividade não encontrada.');
  return atividades;
}

// Exclusão física: use apenas em rotas administrativas.
export async function deleteAtividades(id: bigint) {
  const atividades = await db.orm.public.Atividades.where({ id }).delete();
  if (!atividades) throw new HttpError(404, 'Atividade não encontrada.');
}