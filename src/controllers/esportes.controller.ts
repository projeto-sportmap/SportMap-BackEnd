// Arquivo: src/controllers/esportes.controller.ts
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

export const createEsporte = async (req: Request, res: Response) => {
  const { nome } = req.body ?? {};
    if (typeof nome !== 'string' || !nome.trim()) {
      throw new HttpError(400, 'Nome obrigatório.');
    }
  const nomeLimpo = nome.trim();

  if (nomeLimpo.length > 50) {
     throw new HttpError(400, 'Nome deve ter no máximo 50 caracteres.');
  }
  const esporte = await EsportesService.createEsporte({
    nome: nomeLimpo,
  });
  res.status(201).json(esporte);
};

export const getAllEsportes = async (_req: Request, res: Response) => {
  res.json((await EsportesService.getAllEsportes()).map(EsportesService.toPublicEsporte));
};

export const getEsportesById = async (req: Request, res: Response) => {
  res.json(EsportesService.toPublicEsporte(await EsportesService.getEsporteById(readId(req))));
};

export const updateEsportes = async (req: Request, res: Response) => {
  res.json(EsportesService.toPublicEsporte(await EsportesService.updateEsporte(readId(req), req.body ?? {})));
};

export const deleteEsportes = async (req: Request, res: Response) => {
  await EsportesService.deleteEsporte(readId(req));
  res.status(204).send();
};