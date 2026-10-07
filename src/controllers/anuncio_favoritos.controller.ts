import type { Request, Response } from 'express';
import * as AnuncioFavoritosService from '../services/anuncio_favoritos.service.js';
import { HttpError } from '../lib/http-error.js';

const MAX_BIGINT = 9223372036854775807n;

const readBigInt = (value: unknown, campo: string) => {
  const texto = String(value ?? '');
  if (!/^\d+$/.test(texto)) {
    throw new HttpError(400, `${campo} deve ser um inteiro positivo válido.`);
  }
  const numero = BigInt(texto);
  if (numero < 1n || numero > MAX_BIGINT) {
    throw new HttpError(400, `${campo} deve ser um inteiro positivo válido.`);
  }
  return numero;
};

const readPositiveInt = (value: unknown, padrao: number) => {
  if (value === undefined) return padrao;
  const numero = Number(value);
  if (!Number.isSafeInteger(numero) || numero < 0) {
    throw new HttpError(400, 'Parâmetro de paginação inválido.');
  }
  return numero;
};

export const createAnuncioFavoritos = async (req: Request, res: Response) => {
  const body = req.body ?? {};

  const favoritos = await AnuncioFavoritosService.createAnuncioFavoritos({
    // Provisório: quando houver middleware, trocar pelo id do token.
    usuarioId: readBigInt(body.usuarioId, 'usuarioId'),
    anuncioId: readBigInt(body.anuncioId, 'anuncioId')
  });

  res.status(201).json(AnuncioFavoritosService.toPublicAnuncioFavoritos(favoritos));
};

export const getAllAnuncioFavoritos = async (req: Request, res: Response) => {
  const limit = readPositiveInt(req.query.limit, 20);
  const offset = readPositiveInt(req.query.offset, 0);
  const usuarioId =
    req.query.usuarioId === undefined ? undefined : readBigInt(req.query.usuarioId, 'usuarioId');

  const lista = await AnuncioFavoritosService.getAllAnuncioFavoritos(limit, offset, usuarioId);
  res.json(lista.map(AnuncioFavoritosService.toPublicAnuncioFavoritos));
};

export const getAnuncioFavoritosById = async (req: Request, res: Response) => {
  const favoritos = await AnuncioFavoritosService.getAnuncioFavoritosById(readBigInt(req.params.id, 'id'));
  res.json(AnuncioFavoritosService.toPublicAnuncioFavoritos(favoritos));
};

export const deleteAnuncioFavoritos = async (req: Request, res: Response) => {
  await AnuncioFavoritosService.deleteAnuncioFavoritos(readBigInt(req.params.id, 'id'));
  res.status(204).send();
};