import type { Request, Response } from 'express';
import * as SeguidoresService from '../services/seguidores.service.js';
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

export const createSeguidores = async (req: Request, res: Response) => {
  const { seguidorId, seguidoId } = req.body ?? {};

  const seguidores = await SeguidoresService.createSeguidores({
    seguidorId: readBigInt(seguidorId, 'seguidorId'),
    seguidoId: readBigInt(seguidoId, 'seguidoId')
  });

  res.status(201).json(SeguidoresService.toPublicSeguidores(seguidores));
};

export const getAllSeguidores = async (req: Request, res: Response) => {
  const limit = readPositiveInt(req.query.limit, 20);
  const offset = readPositiveInt(req.query.offset, 0);

  const lista = await SeguidoresService.getAllSeguidores(limit, offset);
  res.json(lista.map(SeguidoresService.toPublicSeguidores));
};

export const getSeguidor = async (req: Request, res: Response) => {
  const seguidores = await SeguidoresService.getSeguidor(
    readBigInt(req.params.seguidorId, 'seguidorId'),
    readBigInt(req.params.seguidoId, 'seguidoId')
  );

  res.json(SeguidoresService.toPublicSeguidores(seguidores));
};

export const deleteSeguidores = async (req: Request, res: Response) => {
  await SeguidoresService.deleteSeguidores(
    readBigInt(req.params.seguidorId, 'seguidorId'),
    readBigInt(req.params.seguidoId, 'seguidoId')
  );

  res.status(204).send();
};