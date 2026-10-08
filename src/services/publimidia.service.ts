import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export type TipoMidia = 'imagem' | 'video';

export interface CreatePublicacaoMidiaInput {
  publicacaoId: string; // vem como string (bigint)
  tipo: TipoMidia;
  url: string;
  ordem?: number;
}

export interface UpdatePublicacaoMidiaInput {
  tipo?: TipoMidia;
  url?: string;
  ordem?: number;
}

type MidiaRow = Awaited<ReturnType<typeof db.orm.public.PublicacaoMidias.create>>;
type MidiaChanges = Partial<Omit<MidiaRow, 'id' | 'publicacaoId'>>;

// tipo e url são VarChar no banco, que o ORM tipa como Varchar<N> e não como string comum
const toTipoColumn = (tipo: TipoMidia) => tipo as unknown as MidiaRow['tipo'];
const toUrlColumn = (url: string) => url as unknown as MidiaRow['url'];

// bigint não serializa em JSON, então ids vão como string
export const toPublicMidia = (m: MidiaRow) => ({
  id: String(m.id),
  publicacaoId: String(m.publicacaoId),
  tipo: m.tipo,
  url: m.url,
  ordem: m.ordem,
});

async function garantirPublicacao(publicacaoId: bigint) {
  const publicacao = await db.orm.public.Publicacoes.first({ id: publicacaoId });
  if (!publicacao) throw new HttpError(404, 'Publicação não encontrada.');
}

// Próxima posição livre: maior ordem do post + 1 (ou 0 se não houver mídias)
async function proximaOrdem(publicacaoId: bigint) {
  const midias = await db.orm.public.PublicacaoMidias.where({ publicacaoId }).all();
  if (midias.length === 0) return 0;
  return Math.max(...midias.map((m) => Number(m.ordem))) + 1;
}

async function garantirOrdemLivre(publicacaoId: bigint, ordem: number, ignorarId?: bigint) {
  const existente = await db.orm.public.PublicacaoMidias.first({ publicacaoId, ordem });
  if (existente && existente.id !== ignorarId) {
    throw new HttpError(409, 'Já existe uma mídia nesta posição da publicação.');
  }
}

export async function createPublicacaoMidia(data: CreatePublicacaoMidiaInput) {
  const publicacaoId = BigInt(data.publicacaoId);
  await garantirPublicacao(publicacaoId);

  const ordem = data.ordem ?? (await proximaOrdem(publicacaoId));
  if (ordem > 32767) throw new HttpError(400, 'Limite de mídias da publicação atingido.');

  // O banco também bloqueia (uq_publicacao_midias_ord), mas assim devolvemos um erro claro
  await garantirOrdemLivre(publicacaoId, ordem);

  return db.orm.public.PublicacaoMidias.create({
    publicacaoId,
    tipo: toTipoColumn(data.tipo),
    url: toUrlColumn(data.url),
    ordem,
  });
}

// Filtro opcional; ordenado por post e depois pela posição
export async function getAllPublicacaoMidias(filtros: { publicacaoId?: string } = {}) {
  let lista = await db.orm.public.PublicacaoMidias.all();
  if (filtros.publicacaoId) lista = lista.filter((m) => String(m.publicacaoId) === filtros.publicacaoId);
  return lista.sort(
    (a, b) => Number(a.publicacaoId) - Number(b.publicacaoId) || Number(a.ordem) - Number(b.ordem),
  );
}

export async function getPublicacaoMidiaById(id: number) {
  const midia = await db.orm.public.PublicacaoMidias.first({ id: BigInt(id) });
  if (!midia) throw new HttpError(404, 'Mídia não encontrada.');
  return midia;
}

export async function updatePublicacaoMidia(id: number, data: UpdatePublicacaoMidiaInput) {
  const atual = await getPublicacaoMidiaById(id);

  const changes: MidiaChanges = {};
  if (data.tipo !== undefined) changes.tipo = toTipoColumn(data.tipo);
  if (data.url !== undefined) changes.url = toUrlColumn(data.url);
  if (data.ordem !== undefined) {
    await garantirOrdemLivre(atual.publicacaoId, data.ordem, atual.id);
    changes.ordem = data.ordem;
  }

  if (Object.keys(changes).length === 0) throw new HttpError(400, 'Informe pelo menos um campo.');
  const midia = await db.orm.public.PublicacaoMidias.where({ id: BigInt(id) }).update(changes);
  if (!midia) throw new HttpError(404, 'Mídia não encontrada.');
  return midia;
}

export async function deletePublicacaoMidia(id: number) {
  const midia = await db.orm.public.PublicacaoMidias.where({ id: BigInt(id) }).delete();
  if (!midia) throw new HttpError(404, 'Mídia não encontrada.');
}