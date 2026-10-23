import type { Request, Response } from 'express';
import * as EsportesService from '../services/esportes.service.js';
import { HttpError } from '../lib/http-error.js';

const readId = (req: Request) => {
  const value = String(req.params.id);
  const id = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(400, 'ID deve ser um inteiro positivo válido.');
  }
  return id;
};

const readNome = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, 'Nome obrigatório.');
  }
  const limpo = value.trim();
  if (limpo.length > 50) {
    throw new HttpError(400, 'Nome deve ter no máximo 50 caracteres.');
  }
  return limpo;
};

export const createEsporte = async (req: Request, res: Response) => {
  const esporte = await EsportesService.createEsporte({
    nome: readNome(req.body?.nome),
  });
  res.status(201).json(EsportesService.toPublicEsporte(esporte));
};

export const getAllEsportes = async (_req: Request, res: Response) => {
  res.json((await EsportesService.getAllEsportes()).map(EsportesService.toPublicEsporte));
};

export const getEsportesById = async (req: Request, res: Response) => {
  res.json(EsportesService.toPublicEsporte(await EsportesService.getEsporteById(readId(req))));
};

export const updateEsportes = async (req: Request, res: Response) => {
  const { nome } = req.body ?? {};
  const data = nome === undefined ? {} : { nome: readNome(nome) };

  res.json(EsportesService.toPublicEsporte(await EsportesService.updateEsporte(readId(req), data)));
};

export const deleteEsportes = async (req: Request, res: Response) => {
  await EsportesService.deleteEsporte(readId(req));
  res.status(204).send();
};