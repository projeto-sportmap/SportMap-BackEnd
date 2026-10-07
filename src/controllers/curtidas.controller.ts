import type { Request, Response } from 'express';
import * as CurtidasService from '../services/curtidas.service.js';
import { HttpError } from '../lib/http-error.js';

const readId = (req: Request) => {
  const value = String(req.params.id);
  const id = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(400, 'ID deve ser um inteiro positivo válido.');
  }
  return id;
};

export const createCurtida = async (req: Request, res: Response) => {
  const curtida = await CurtidasService.createCurtida(req.body);
  res.status(201).json(CurtidasService.toPublicCurtida(curtida));
};

export const getAllCurtidas = async (req: Request, res: Response) => {
  const { publicacaoId, usuarioId } = req.query as { publicacaoId?: string; usuarioId?: string };
  const lista = await CurtidasService.getAllCurtidas({ publicacaoId, usuarioId });
  res.json(lista.map(CurtidasService.toPublicCurtida));
};

export const getCurtidaById = async (req: Request, res: Response) => {
  res.json(CurtidasService.toPublicCurtida(await CurtidasService.getCurtidaById(readId(req))));
};

export const deleteCurtida = async (req: Request, res: Response) => {
  await CurtidasService.deleteCurtida(readId(req));
  res.status(204).send();
};