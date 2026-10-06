import type { Request, Response } from 'express';
import * as ConversasService from '../services/conversas.service.js';
import { HttpError } from '../lib/http-error.js';

const MAX_BIGINT = 9223372036854775807n;

const readId = (req: Request) => {
  const value = String(req.params.id);
  if (!/^\d+$/.test(value)) {
    throw new HttpError(400, 'ID deve ser um inteiro positivo válido.');
  }
  const id = BigInt(value);
  if (id < 1n || id > MAX_BIGINT) {
    throw new HttpError(400, 'ID deve ser um inteiro positivo válido.');
  }
  return id;
};

const readPositiveInt = (value: unknown, padrao: number) => {
  if (value === undefined) return padrao;
  const numero = Number(value);
  if (!Number.isSafeInteger(numero) || numero < 0) {
    throw new HttpError(400, 'Parâmetro de paginação inválido.');
  }
  return numero;
};

export const createConversas = async (_req: Request, res: Response) => {
  const conversas = await ConversasService.createConversas();
  res.status(201).json(ConversasService.toPublicConversas(conversas));
};

export const getAllConversas = async (req: Request, res: Response) => {
  const limit = readPositiveInt(req.query.limit, 20);
  const offset = readPositiveInt(req.query.offset, 0);

  const lista = await ConversasService.getAllConversas(limit, offset);
  res.json(lista.map(ConversasService.toPublicConversas));
};

export const getConversasById = async (req: Request, res: Response) => {
  res.json(ConversasService.toPublicConversas(await ConversasService.getConversasById(readId(req))));
};

export const deleteConversas = async (req: Request, res: Response) => {
  await ConversasService.deleteConversas(readId(req));
  res.status(204).send();
};