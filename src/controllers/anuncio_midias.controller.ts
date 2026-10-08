import type { Request, Response } from 'express';
import * as AnuncioMidiasService from '../services/anuncio_midias.service.js';
import { HttpError } from '../lib/http-error.js';

const MAX_BIGINT = 9223372036854775807n;
const MAX_SMALLINT = 32767;

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

const readUrl = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, 'URL obrigatória.');
  }
  const limpa = value.trim();
  if (limpa.length > 500) {
    throw new HttpError(400, 'URL deve ter no máximo 500 caracteres.');
  }
  try {
    new URL(limpa);
  } catch {
    throw new HttpError(400, 'URL inválida.');
  }
  return limpa;
};

const readOrdem = (value: unknown) => {
  const texto = String(value ?? '');
  const numero = Number(texto);
  if (!/^\d+$/.test(texto) || !Number.isSafeInteger(numero) || numero > MAX_SMALLINT) {
    throw new HttpError(400, `Ordem deve ser um inteiro entre 0 e ${MAX_SMALLINT}.`);
  }
  return numero;
};

export const createAnuncioMidias = async (req: Request, res: Response) => {
  const body = req.body ?? {};

  const midias = await AnuncioMidiasService.createAnuncioMidias({
    anuncioId: readBigInt(body.anuncioId, 'anuncioId'),
    url: readUrl(body.url),
    ordem: body.ordem === undefined ? undefined : readOrdem(body.ordem)
  });

  res.status(201).json(AnuncioMidiasService.toPublicAnuncioMidias(midias));
};

export const getAllAnuncioMidias = async (req: Request, res: Response) => {
  const limit = readPositiveInt(req.query.limit, 20);
  const offset = readPositiveInt(req.query.offset, 0);
  const anuncioId =
    req.query.anuncioId === undefined ? undefined : readBigInt(req.query.anuncioId, 'anuncioId');

  const lista = await AnuncioMidiasService.getAllAnuncioMidias(limit, offset, anuncioId);
  res.json(lista.map(AnuncioMidiasService.toPublicAnuncioMidias));
};

export const getAnuncioMidiasById = async (req: Request, res: Response) => {
  const midias = await AnuncioMidiasService.getAnuncioMidiasById(readBigInt(req.params.id, 'id'));
  res.json(AnuncioMidiasService.toPublicAnuncioMidias(midias));
};

export const updateAnuncioMidias = async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const changes: AnuncioMidiasService.UpdateAnuncioMidiasInput = {};

  if (body.url !== undefined) changes.url = readUrl(body.url);
  if (body.ordem !== undefined) changes.ordem = readOrdem(body.ordem);

  const midias = await AnuncioMidiasService.updateAnuncioMidias(readBigInt(req.params.id, 'id'), changes);
  res.json(AnuncioMidiasService.toPublicAnuncioMidias(midias));
};

export const deleteAnuncioMidias = async (req: Request, res: Response) => {
  await AnuncioMidiasService.deleteAnuncioMidias(readBigInt(req.params.id, 'id'));
  res.status(204).send();
};