import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export interface CreateAvaliacoesInput {
  avaliadorId: bigint;
  anuncioId: bigint;
  nota: number;
  comentario?: string | null;
}

export interface UpdateAvaliacoesInput {
  nota?: number;
  comentario?: string | null;
}

type AvaliacoesRow = Awaited<ReturnType<typeof db.orm.public.Avaliacoes.create>>;

export const toPublicAvaliacoes = (avaliacoes: AvaliacoesRow) => ({
  id: avaliacoes.id.toString(),
  avaliadorId: avaliacoes.avaliadorId.toString(),
  anuncioId: avaliacoes.anuncioId.toString(),
  nota: Number(avaliacoes.nota),
  comentario: avaliacoes.comentario,
  createdAt: avaliacoes.createdAt
});

function validarNota(nota: number) {
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    throw new HttpError(400, 'Nota deve ser um inteiro entre 1 e 5.');
  }
}

export async function createAvaliacoes(data: CreateAvaliacoesInput) {
  validarNota(data.nota);

  const [avaliador, anuncio] = await Promise.all([
    db.orm.public.Usuarios.first({ id: data.avaliadorId }),
    db.orm.public.Anuncios.first({ id: data.anuncioId })
  ]);
  if (!avaliador) throw new HttpError(404, 'Usuário avaliador não encontrado.');
  if (!anuncio) throw new HttpError(404, 'Anúncio não encontrado.');

  if (anuncio.usuarioId === data.avaliadorId) {
    throw new HttpError(400, 'Você não pode avaliar o seu próprio anúncio.');
  }

  const existente = await db.orm.public.Avaliacoes.first({
    avaliadorId: data.avaliadorId,
    anuncioId: data.anuncioId
  });
  if (existente) throw new HttpError(409, 'Você já avaliou este anúncio.');

  return db.orm.public.Avaliacoes.create({
    avaliadorId: data.avaliadorId,
    anuncioId: data.anuncioId,
    nota: data.nota,
    comentario: data.comentario ?? null
  } as never);
}

export async function getAllAvaliacoes(limit = 20, offset = 0, anuncioId?: bigint) {
  const take = Math.min(Math.max(limit, 1), 100);
  const skip = Math.max(offset, 0);

  const colecao = (
    anuncioId === undefined
      ? db.orm.public.Avaliacoes
      : db.orm.public.Avaliacoes.where({ anuncioId })
  ) as unknown as typeof db.orm.public.Avaliacoes;

  const resultado: AvaliacoesRow[] = [];
  let indice = 0;

  for await (const avaliacao of colecao.all()) {
    if (indice >= skip + take) break;
    if (indice >= skip) resultado.push(avaliacao);
    indice++;
  }

  return resultado;
}

export async function getAvaliacoesById(id: bigint) {
  const avaliacoes = await db.orm.public.Avaliacoes.first({ id });
  if (!avaliacoes) throw new HttpError(404, 'Avaliação não encontrada.');
  return avaliacoes;
}

export async function getMediaPorAnuncio(anuncioId: bigint) {
  const anuncio = await db.orm.public.Anuncios.first({ id: anuncioId });
  if (!anuncio) throw new HttpError(404, 'Anúncio não encontrado.');

  let total = 0;
  let soma = 0;

  for await (const avaliacao of db.orm.public.Avaliacoes.where({ anuncioId }).all()) {
    soma += Number(avaliacao.nota);
    total++;
  }

  return {
    anuncioId: anuncioId.toString(),
    media: total === 0 ? null : Math.round((soma / total) * 100) / 100,
    total
  };
}

export async function updateAvaliacoes(id: bigint, data: UpdateAvaliacoesInput) {
  const changes: UpdateAvaliacoesInput = {};
  if (data.nota !== undefined) {
    validarNota(data.nota);
    changes.nota = data.nota;
  }
  if (data.comentario !== undefined) changes.comentario = data.comentario;
  if (Object.keys(changes).length === 0) throw new HttpError(400, 'Informe pelo menos um campo.');

  const avaliacoes = await db.orm.public.Avaliacoes.where({ id }).update(changes as never);
  if (!avaliacoes) throw new HttpError(404, 'Avaliação não encontrada.');
  return avaliacoes;
}

export async function deleteAvaliacoes(id: bigint) {
  const avaliacoes = await db.orm.public.Avaliacoes.where({ id }).delete();
  if (!avaliacoes) throw new HttpError(404, 'Avaliação não encontrada.');
}