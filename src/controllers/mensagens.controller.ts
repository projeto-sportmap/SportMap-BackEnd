import type { Request, Response } from 'express';
import * as MensagensService from '../services/mensagens.service.js';
import { HttpError } from '../lib/http-error.js';

const MAX_BIGINT = 9223372036854775807n;
const MAX_CONTEUDO = 5000;

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

const readConteudo = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, 'Conteúdo obrigatório.');
  }
  const limpo = value.trim();
  if (limpo.length > MAX_CONTEUDO) {
    throw new HttpError(400, `Conteúdo deve ter no máximo ${MAX_CONTEUDO} caracteres.`);
  }
  return limpo;
};

export const createMensagens = async (req: Request, res: Response) => {
  const body = req.body ?? {};

  const mensagens = await MensagensService.createMensagens({
    conversaId: readBigInt(body.conversaId, 'conversaId'),
    // Provisório: quando houver middleware, trocar pelo id do token.
    remetenteId: readBigInt(body.remetenteId, 'remetenteId'),
    conteudo: readConteudo(body.conteudo)
  });

  res.status(201).json(MensagensService.toPublicMensagens(mensagens));
};

export const getAllMensagens = async (req: Request, res: Response) => {
  const limit = readPositiveInt(req.query.limit, 20);
  const offset = readPositiveInt(req.query.offset, 0);
  const conversaId =
    req.query.conversaId === undefined ? undefined : readBigInt(req.query.conversaId, 'conversaId');

  const lista = await MensagensService.getAllMensagens(limit, offset, conversaId);
  res.json(lista.map(MensagensService.toPublicMensagens));
};

export const getMensagensById = async (req: Request, res: Response) => {
  const mensagens = await MensagensService.getMensagensById(readBigInt(req.params.id, 'id'));
  res.json(MensagensService.toPublicMensagens(mensagens));
};

export const marcarComoLida = async (req: Request, res: Response) => {
  const mensagens = await MensagensService.marcarComoLida(readBigInt(req.params.id, 'id'));
  res.json(MensagensService.toPublicMensagens(mensagens));
};

export const deleteMensagens = async (req: Request, res: Response) => {
  await MensagensService.deleteMensagens(readBigInt(req.params.id, 'id'));
  res.status(204).send();
};