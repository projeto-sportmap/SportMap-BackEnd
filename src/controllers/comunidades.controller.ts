import type { Request, Response } from 'express';
import * as ComunidadesService from '../services/comunidades.service.js';
import { HttpError } from '../lib/http-error.js';

const readId = (req: Request) => {
  const value = String(req.params.id);
  const id = Number(value);

  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(400, 'ID deve ser um inteiro positivo válido.');
  }

  return id;
};

export const createComunidade = async (req: Request, res: Response) => {
  const comunidade = await ComunidadesService.createComunidade(Number(res.locals.userId), req.body);

  res.status(201).json(ComunidadesService.toPublicComunidade(comunidade));
};

export const getAllComunidades = async (_req: Request, res: Response) => {
  const comunidades = await ComunidadesService.getAllComunidades();

  res.json(comunidades.map(ComunidadesService.toPublicComunidade));
};

export const getComunidadeById = async (req: Request, res: Response) => {
  const comunidade = await ComunidadesService.getComunidadeDetalhe(
    readId(req),
    Number(res.locals.userId),
  );

  res.json(comunidade);
};

export const getPublicacoesDaComunidade = async (req: Request, res: Response) => {
  const publicacoes = await ComunidadesService.getPublicacoesDaComunidade(readId(req));

  res.json(publicacoes);
};

export const updateComunidade = async (req: Request, res: Response) => {
  const comunidade = await ComunidadesService.updateComunidade(
    readId(req),
    Number(res.locals.userId),
    req.body,
  );

  res.json(ComunidadesService.toPublicComunidade(comunidade));
};

export const deleteComunidade = async (req: Request, res: Response) => {
  await ComunidadesService.deleteComunidade(readId(req), Number(res.locals.userId));

  res.status(204).send();
};

export const participarComunidade = async (req: Request, res: Response) => {
  await ComunidadesService.participarComunidade(readId(req), Number(res.locals.userId));

  res.status(201).json({ message: 'Você agora participa da comunidade.' });
};

export const sairComunidade = async (req: Request, res: Response) => {
  await ComunidadesService.sairComunidade(readId(req), Number(res.locals.userId));

  res.status(204).send();
};