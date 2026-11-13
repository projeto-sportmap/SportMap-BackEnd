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
  const { seguidoId } = req.body ?? {};

  const seguidores = await SeguidoresService.createSeguidores({
    seguidorId: readBigInt(res.locals.userId, 'seguidorId'),
    seguidoId: readBigInt(seguidoId, 'seguidoId')
  });

  res.status(201).json(SeguidoresService.toPublicSeguidores(seguidores));
};

export const getAllSeguidores = async (req: Request, res: Response) => {
  const limit = readPositiveInt(req.query.limit, 20);
  const offset = readPositiveInt(req.query.offset, 0);

  const lista = await SeguidoresService.getAllSeguidores(limit, offset, {
    seguidorId: req.query.seguidorId === undefined
      ? undefined
      : readBigInt(req.query.seguidorId, 'seguidorId'),
    seguidoId: req.query.seguidoId === undefined
      ? undefined
      : readBigInt(req.query.seguidoId, 'seguidoId'),
  });
  res.json(lista.map(SeguidoresService.toPublicSeguidores));
};

export const getSeguidor = async (req: Request, res: Response) => {
  const seguidores = await SeguidoresService.getSeguidor(
    readBigInt(req.params.seguidorId, 'seguidorId'),
    readBigInt(req.params.seguidoId, 'seguidoId')
  );

  res.json(SeguidoresService.toPublicSeguidores(seguidores));
};

export const getResumoSeguidores = async (req: Request, res: Response) => {
  const resumo = await SeguidoresService.getResumoSeguidores(
    readBigInt(req.params.usuarioId, 'usuarioId'),
  );
  res.json(resumo);
};

export const deleteSeguidores = async (req: Request, res: Response) => {
  const seguidorId = readBigInt(req.params.seguidorId, 'seguidorId');
  const usuarioLogado = readBigInt(res.locals.userId, 'seguidorId');
  if (seguidorId !== usuarioLogado) {
    throw new HttpError(403, 'VocÃª sÃ³ pode alterar os seus prÃ³prios relacionamentos.');
  }

  await SeguidoresService.deleteSeguidores(
    seguidorId,
    readBigInt(req.params.seguidoId, 'seguidoId')
  );

  res.status(204).send();
};
