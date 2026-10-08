import type { Request, Response } from 'express';
import * as MidiasService from '../services/publimidia.service.js';
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
export const createPublicacaoMidia = async (req: Request, res: Response) => {
  const midia = await MidiasService.createPublicacaoMidia(req.body);
  res.status(201).json(MidiasService.toPublicMidia(midia));
};

export const getAllPublicacaoMidias = async (req: Request, res: Response) => {
  const { publicacaoId } = req.query as { publicacaoId?: string };
  const lista = await MidiasService.getAllPublicacaoMidias({ publicacaoId });
  res.json(lista.map(MidiasService.toPublicMidia));
};

export const getPublicacaoMidiaById = async (req: Request, res: Response) => {
  res.json(MidiasService.toPublicMidia(await MidiasService.getPublicacaoMidiaById(readId(req))));
};

export const updatePublicacaoMidia = async (req: Request, res: Response) => {
  const midia = await MidiasService.updatePublicacaoMidia(readId(req), req.body);
  res.json(MidiasService.toPublicMidia(midia));
};

export const deletePublicacaoMidia = async (req: Request, res: Response) => {
  await MidiasService.deletePublicacaoMidia(readId(req));
  res.status(204).send();
};