import type { Request, Response } from 'express';
import * as PublicacoesService from '../services/publicacoes.service.js';
import { HttpError } from '../lib/http-error.js';

const readId = (req: Request) => {
  const value = String(req.params.id);
  const id = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(400, 'ID deve ser um inteiro positivo válido.');
  }
  return id;
};

// Os dados já chegam validados e limpos pelo middleware validate (Zod)
export const createPublicacao = async (req: Request, res: Response) => {
  const publicacao = await PublicacoesService.createPublicacao(req.body);
  res.status(201).json(PublicacoesService.toPublicPublicacao(publicacao));
};

export const getAllPublicacoes = async (req: Request, res: Response) => {
  const { usuarioId, esporteId } = req.query as { usuarioId?: string; esporteId?: string };
  const lista = await PublicacoesService.getAllPublicacoes({ usuarioId, esporteId });
  res.json(lista.map(PublicacoesService.toPublicPublicacao));
};

export const getPublicacaoById = async (req: Request, res: Response) => {
  res.json(PublicacoesService.toPublicPublicacao(await PublicacoesService.getPublicacaoById(readId(req))));
};

export const updatePublicacao = async (req: Request, res: Response) => {
  const publicacao = await PublicacoesService.updatePublicacao(readId(req), req.body);
  res.json(PublicacoesService.toPublicPublicacao(publicacao));
};

export const deletePublicacao = async (req: Request, res: Response) => {
  await PublicacoesService.deletePublicacao(readId(req));
  res.status(204).send();
};