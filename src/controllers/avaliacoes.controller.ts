import type { Request, Response } from 'express';
import * as AvaliacoesService from '../services/avaliacoes.service.js';
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

const readNota = (value: unknown) => {
  const texto = String(value ?? '');
  const nota = Number(texto);
  if (!/^\d+$/.test(texto) || !Number.isInteger(nota) || nota < 1 || nota > 5) {
    throw new HttpError(400, 'Nota deve ser um inteiro entre 1 e 5.');
  }
  return nota;
};

const readComentario = (value: unknown) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw new HttpError(400, 'Comentário deve ser um texto.');
  }
  const limpo = value.trim();
  if (limpo.length > 1000) {
    throw new HttpError(400, 'Comentário deve ter no máximo 1000 caracteres.');
  }
  return limpo;
};

export const createAvaliacoes = async (req: Request, res: Response) => {
  const body = req.body ?? {};

  const avaliacoes = await AvaliacoesService.createAvaliacoes({
    // Provisório: quando houver middleware, trocar pelo id do token.
    avaliadorId: readBigInt(body.avaliadorId, 'avaliadorId'),
    anuncioId: readBigInt(body.anuncioId, 'anuncioId'),
    nota: readNota(body.nota),
    comentario: readComentario(body.comentario) ?? null
  });

  res.status(201).json(AvaliacoesService.toPublicAvaliacoes(avaliacoes));
};

export const getAllAvaliacoes = async (req: Request, res: Response) => {
  const limit = readPositiveInt(req.query.limit, 20);
  const offset = readPositiveInt(req.query.offset, 0);
  const anuncioId =
    req.query.anuncioId === undefined ? undefined : readBigInt(req.query.anuncioId, 'anuncioId');

  const lista = await AvaliacoesService.getAllAvaliacoes(limit, offset, anuncioId);
  res.json(lista.map(AvaliacoesService.toPublicAvaliacoes));
};

export const getMediaPorAnuncio = async (req: Request, res: Response) => {
  const media = await AvaliacoesService.getMediaPorAnuncio(readBigInt(req.params.anuncioId, 'anuncioId'));
  res.json(media);
};

export const getAvaliacoesById = async (req: Request, res: Response) => {
  const avaliacoes = await AvaliacoesService.getAvaliacoesById(readBigInt(req.params.id, 'id'));
  res.json(AvaliacoesService.toPublicAvaliacoes(avaliacoes));
};

export const updateAvaliacoes = async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const changes: AvaliacoesService.UpdateAvaliacoesInput = {};

  if (body.nota !== undefined) changes.nota = readNota(body.nota);
  if (body.comentario !== undefined) changes.comentario = readComentario(body.comentario);

  const avaliacoes = await AvaliacoesService.updateAvaliacoes(readBigInt(req.params.id, 'id'), changes);
  res.json(AvaliacoesService.toPublicAvaliacoes(avaliacoes));
};

export const deleteAvaliacoes = async (req: Request, res: Response) => {
  await AvaliacoesService.deleteAvaliacoes(readBigInt(req.params.id, 'id'));
  res.status(204).send();
};