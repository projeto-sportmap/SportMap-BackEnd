import type { Request, Response } from 'express';
import * as AtividadesService from '../services/atividades.service.js';
import { HttpError } from '../lib/http-error.js';

const MAX_BIGINT = 9223372036854775807n;
const MAX_INT = 2147483647;

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

const readInt = (value: unknown, campo: string) => {
  const texto = String(value ?? '');
  const numero = Number(texto);
  if (!/^\d+$/.test(texto) || !Number.isSafeInteger(numero) || numero < 1 || numero > MAX_INT) {
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

const readDescricao = (value: unknown) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw new HttpError(400, 'Descrição deve ser um texto.');
  }
  const limpo = value.trim();
  if (limpo.length > 500) {
    throw new HttpError(400, 'Descrição deve ter no máximo 500 caracteres.');
  }
  return limpo;
};

const readEnum = <T extends string>(value: unknown, campo: string, permitidos: readonly T[]) => {
  if (typeof value !== 'string' || !permitidos.includes(value as T)) {
    throw new HttpError(400, `${campo} deve ser um de: ${permitidos.join(', ')}.`);
  }
  return value as T;
};

const readCoordenada = (value: unknown, campo: string, limite: number) => {
  const texto = String(value ?? '');
  const numero = Number(texto);
  if (!/^-?\d+(\.\d{1,6})?$/.test(texto) || !Number.isFinite(numero) || Math.abs(numero) > limite) {
    throw new HttpError(400, `${campo} deve estar entre -${limite} e ${limite}, com até 6 casas decimais.`);
  }
  return texto;
};

const readData = (value: unknown, campo: string) => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new HttpError(400, `${campo} deve ser uma data válida.`);
  }
  const data = new Date(value);
  if (Number.isNaN(data.getTime())) {
    throw new HttpError(400, `${campo} deve ser uma data válida.`);
  }
  return data;
};

export const createAtividades = async (req: Request, res: Response) => {
  const body = req.body ?? {};

  const atividades = await AtividadesService.createAtividades({
    // Provisório: quando houver middleware, trocar pelo id do token.
    usuarioId: readBigInt(body.usuarioId, 'usuarioId'),
    esporteId: readInt(body.esporteId, 'esporteId'),
    descricao: readDescricao(body.descricao) ?? null,
    latitude: readCoordenada(body.latitude, 'Latitude', 90),
    longitude: readCoordenada(body.longitude, 'Longitude', 180),
    expiraEm: readData(body.expiraEm, 'expiraEm')
  });

  res.status(201).json(AtividadesService.toPublicAtividades(atividades));
};

export const getAllAtividades = async (req: Request, res: Response) => {
  const { esporteId, status } = req.query;

  const lista = await AtividadesService.getAllAtividades({
    esporteId: esporteId === undefined ? undefined : readInt(esporteId, 'esporteId'),
    status:
      status === undefined ? undefined : readEnum(status, 'Status', AtividadesService.STATUS_ATIVIDADE),
    limit: readPositiveInt(req.query.limit, 20),
    offset: readPositiveInt(req.query.offset, 0)
  });

  res.json(lista.map(AtividadesService.toPublicAtividades));
};

export const getAtividadesById = async (req: Request, res: Response) => {
  const atividades = await AtividadesService.getAtividadesById(readBigInt(req.params.id, 'id'));
  res.json(AtividadesService.toPublicAtividades(atividades));
};

export const updateAtividades = async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const changes: AtividadesService.UpdateAtividadesInput = {};

  if (body.descricao !== undefined) changes.descricao = readDescricao(body.descricao);
  if (body.status !== undefined) {
    changes.status = readEnum(body.status, 'Status', AtividadesService.STATUS_ATIVIDADE);
  }
  if (body.expiraEm !== undefined) changes.expiraEm = readData(body.expiraEm, 'expiraEm');

  const atividades = await AtividadesService.updateAtividades(readBigInt(req.params.id, 'id'), changes);
  res.json(AtividadesService.toPublicAtividades(atividades));
};

// Cancelamento lógico (status = 'cancelada').
export const cancelarAtividades = async (req: Request, res: Response) => {
  const atividades = await AtividadesService.cancelarAtividades(readBigInt(req.params.id, 'id'));
  res.json(AtividadesService.toPublicAtividades(atividades));
};

// Exclusão física: use apenas em rotas administrativas.
export const deleteAtividades = async (req: Request, res: Response) => {
  await AtividadesService.deleteAtividades(readBigInt(req.params.id, 'id'));
  res.status(204).send();
};