
import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export const CONDICOES = ['novo', 'seminovo', 'usado'] as const;
export const STATUS = ['ativo', 'pausado', 'vendido', 'removido'] as const;

export type Condicao = (typeof CONDICOES)[number];
export type StatusAnuncio = (typeof STATUS)[number];

export interface CreateAnunciosInput {
  usuarioId: bigint;
  titulo: string;
  descricao?: string | null;
  preco: string;
  esporteId?: number | null;
  condicao: Condicao;
  latitude?: string | null;
  longitude?: string | null;
  cidade?: string | null;
  imagemUrl?: string | null;
}

export type UpdateAnunciosInput = Partial<Omit<CreateAnunciosInput, 'usuarioId'>> & {
  status?: StatusAnuncio;
};

export interface FiltrosAnuncios {
  esporteId?: number;
  cidade?: string;
  status?: StatusAnuncio;
  limit?: number;
  offset?: number;
}

type AnunciosRow = Awaited<
  ReturnType<typeof db.orm.public.Anuncios.create>
>;

type AnuncioMidiasRow = Awaited<
  ReturnType<typeof db.orm.public.AnuncioMidias.create>
>;

type AnuncioComMidias = AnunciosRow & {
  midias: AnuncioMidiasRow[];
};

// Busca todas as imagens relacionadas a um anúncio.
async function buscarMidias(anuncioId: bigint) {
  const midias: AnuncioMidiasRow[] = [];

  for await (const midia of db.orm.public.AnuncioMidias.where({
    anuncioId
  }).all()) {
    midias.push(midia);
  }

  return midias.sort((a, b) => Number(a.ordem) - Number(b.ordem));
}

// Retorna os dados públicos do anúncio e suas imagens.
export const toPublicAnuncios = (
  anuncios: AnunciosRow & { midias?: AnuncioMidiasRow[] }
) => {
  const midias = (anuncios.midias ?? []).map(midia => ({
    id: midia.id.toString(),
    anuncioId: midia.anuncioId.toString(),
    url: String(midia.url),
    ordem: Number(midia.ordem)
  }));

  return {
    id: anuncios.id.toString(),
    usuarioId: anuncios.usuarioId.toString(),
    titulo: anuncios.titulo,
    descricao: anuncios.descricao,
    preco: String(anuncios.preco),
    esporteId: anuncios.esporteId,
    condicao: anuncios.condicao,
    status: anuncios.status,
    latitude: anuncios.latitude === null ? null : String(anuncios.latitude),
    longitude: anuncios.longitude === null ? null : String(anuncios.longitude),
    cidade: anuncios.cidade,
    createdAt: anuncios.createdAt,

    // Compatibilidade com o Marketplace que utiliza uma imagem principal.
    imagem: midias[0]?.url ?? null,

    // Todas as mídias do anúncio.
    midias
  };
};

async function garantirEsporte(esporteId: number) {
  const esporte = await db.orm.public.Esportes.first({
    id: esporteId
  });

  if (!esporte) {
    throw new HttpError(404, 'Esporte não encontrado.');
  }
}

// Criação de anúncio e registro opcional da imagem.
export async function createAnuncios(data: CreateAnunciosInput) {
  const usuario = await db.orm.public.Usuarios.first({
    id: data.usuarioId
  });

  if (!usuario) {
    throw new HttpError(404, 'Usuário não encontrado.');
  }

  if (data.esporteId != null) {
    await garantirEsporte(data.esporteId);
  }

  const anuncio = await db.orm.public.Anuncios.create({
    usuarioId: data.usuarioId,
    titulo: data.titulo,
    descricao: data.descricao ?? null,
    preco: data.preco,
    esporteId: data.esporteId ?? null,
    condicao: data.condicao,
    status: 'ativo',
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    cidade: data.cidade ?? null
  } as never);

  if (data.imagemUrl) {
    await db.orm.public.AnuncioMidias.create({
      anuncioId: anuncio.id,
      url: data.imagemUrl,
      ordem: 0
    } as never);
  }

  const midias = await buscarMidias(anuncio.id);

  return {
    ...anuncio,
    midias
  } as AnuncioComMidias;
}

// Listagem de anúncios com suas respectivas imagens.
export async function getAllAnuncios(filtros: FiltrosAnuncios = {}) {
  const take = Math.min(Math.max(filtros.limit ?? 20, 1), 100);
  const skip = Math.max(filtros.offset ?? 0, 0);

  const where: {
    status: StatusAnuncio;
    esporteId?: number;
    cidade?: string;
  } = {
    status: filtros.status ?? 'ativo'
  };

  if (filtros.esporteId !== undefined) {
    where.esporteId = filtros.esporteId;
  }

  if (filtros.cidade !== undefined) {
    where.cidade = filtros.cidade;
  }

  const resultado: AnunciosRow[] = [];
  let indice = 0;

  for await (const anuncio of db.orm.public.Anuncios.where(
    where as never
  ).all()) {
    if (indice >= skip + take) break;

    if (indice >= skip) {
      resultado.push(anuncio);
    }

    indice++;
  }

  return Promise.all(
    resultado.map(async anuncio => ({
      ...anuncio,
      midias: await buscarMidias(anuncio.id)
    }))
  );
}

// Busca um anúncio específico com suas imagens.
export async function getAnunciosById(id: bigint) {
  const anuncio = await db.orm.public.Anuncios.first({ id });

  if (!anuncio || String(anuncio.status) === 'removido') {
    throw new HttpError(404, 'Anúncio não encontrado.');
  }

  return {
    ...anuncio,
    midias: await buscarMidias(anuncio.id)
  };
}

async function garantirDono(id: bigint, usuarioId: bigint) {
  const anuncio = await getAnunciosById(id);

  if (anuncio.usuarioId !== usuarioId) {
    throw new HttpError(
      403,
      'Você não tem permissão para alterar este anúncio.'
    );
  }

  return anuncio;
}

// Atualização de anúncio e da imagem principal.
export async function updateAnuncios(
  id: bigint,
  usuarioId: bigint,
  data: UpdateAnunciosInput
) {
  const atual = await garantirDono(id, usuarioId);

  const changes: UpdateAnunciosInput = {};

  if (data.titulo !== undefined) changes.titulo = data.titulo;
  if (data.descricao !== undefined) changes.descricao = data.descricao;
  if (data.preco !== undefined) changes.preco = data.preco;
  if (data.condicao !== undefined) changes.condicao = data.condicao;
  if (data.status !== undefined) changes.status = data.status;
  if (data.cidade !== undefined) changes.cidade = data.cidade;
  if (data.latitude !== undefined) changes.latitude = data.latitude;
  if (data.longitude !== undefined) changes.longitude = data.longitude;

  if (data.esporteId !== undefined) {
    if (data.esporteId !== null) {
      await garantirEsporte(data.esporteId);
    }

    changes.esporteId = data.esporteId;
  }

  if (Object.keys(changes).length > 0) {
    const atualizado = await db.orm.public.Anuncios.where({
      id
    }).update(changes as never);

    if (!atualizado) {
      throw new HttpError(404, 'Anúncio não encontrado.');
    }
  }

  // Se uma nova imagem foi enviada, atualiza a mídia de ordem 0.
  if (data.imagemUrl) {
    const midiaAtual = await db.orm.public.AnuncioMidias.first({
      anuncioId: id,
      ordem: 0
    } as never);

    if (midiaAtual) {
      await db.orm.public.AnuncioMidias.where({
        id: midiaAtual.id
      }).update({
        url: data.imagemUrl
      } as never);
    } else {
      await db.orm.public.AnuncioMidias.create({
        anuncioId: id,
        url: data.imagemUrl,
        ordem: 0
      } as never);
    }
  }

  const midias = await buscarMidias(id);
  const anuncioAtualizado = await db.orm.public.Anuncios.first({ id });

  if (!anuncioAtualizado) {
    throw new HttpError(404, 'Anúncio não encontrado.');
  }

  return {
    ...anuncioAtualizado,
    midias
  };
}

// Exclusão lógica: preserva favoritos, mídias e avaliações.
export async function removerAnuncios(
  id: bigint,
  usuarioId: bigint
) {
  await garantirDono(id, usuarioId);

  const anuncios = await db.orm.public.Anuncios.where({
    id
  }).update({
    status: 'removido'
  } as never);

  if (!anuncios) {
    throw new HttpError(404, 'Anúncio não encontrado.');
  }
}

// Exclusão física: use apenas em rotas administrativas.
export async function deleteAnuncios(id: bigint) {
  const anuncios = await db.orm.public.Anuncios.where({
    id
  }).delete();

  if (!anuncios) {
    throw new HttpError(404, 'Anúncio não encontrado.');
  }
}
