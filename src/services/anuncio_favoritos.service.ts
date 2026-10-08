import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export interface CreateAnuncioFavoritosInput {
  usuarioId: bigint;
  anuncioId: bigint;
}

type AnuncioFavoritosRow = Awaited<ReturnType<typeof db.orm.public.AnuncioFavoritos.create>>;

export const toPublicAnuncioFavoritos = (favoritos: AnuncioFavoritosRow) => ({
  id: favoritos.id.toString(),
  usuarioId: favoritos.usuarioId.toString(),
  anuncioId: favoritos.anuncioId.toString(),
  createdAt: favoritos.createdAt
});

export async function createAnuncioFavoritos(data: CreateAnuncioFavoritosInput) {
  const [usuario, anuncio] = await Promise.all([
    db.orm.public.Usuarios.first({ id: data.usuarioId }),
    db.orm.public.Anuncios.first({ id: data.anuncioId })
  ]);
  if (!usuario) throw new HttpError(404, 'Usuário não encontrado.');
  if (!anuncio || String(anuncio.status) === 'removido') {
    throw new HttpError(404, 'Anúncio não encontrado.');
  }

  const existente = await db.orm.public.AnuncioFavoritos.first({
    usuarioId: data.usuarioId,
    anuncioId: data.anuncioId
  });
  if (existente) throw new HttpError(409, 'Anúncio já está nos favoritos.');

  return db.orm.public.AnuncioFavoritos.create({
    usuarioId: data.usuarioId,
    anuncioId: data.anuncioId
  });
}

export async function getAllAnuncioFavoritos(limit = 20, offset = 0, usuarioId?: bigint) {
  const take = Math.min(Math.max(limit, 1), 100);
  const skip = Math.max(offset, 0);

  const colecao = (
    usuarioId === undefined
      ? db.orm.public.AnuncioFavoritos
      : db.orm.public.AnuncioFavoritos.where({ usuarioId })
  ) as unknown as typeof db.orm.public.AnuncioFavoritos;

  const resultado: AnuncioFavoritosRow[] = [];
  let indice = 0;

  for await (const favorito of colecao.all()) {
    if (indice >= skip + take) break;
    if (indice >= skip) resultado.push(favorito);
    indice++;
  }

  return resultado;
}

export async function getAnuncioFavoritosById(id: bigint) {
  const favoritos = await db.orm.public.AnuncioFavoritos.first({ id });
  if (!favoritos) throw new HttpError(404, 'Favorito não encontrado.');
  return favoritos;
}

export async function deleteAnuncioFavoritos(id: bigint) {
  const favoritos = await db.orm.public.AnuncioFavoritos.where({ id }).delete();
  if (!favoritos) throw new HttpError(404, 'Favorito não encontrado.');
}