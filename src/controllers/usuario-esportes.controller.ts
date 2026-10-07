import type { Request, Response } from 'express';
import * as UsuarioEsportesService from '../services/usuario-esportes.service.js';
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
export const createUsuarioEsporte = async (req: Request, res: Response) => {
  const registro = await UsuarioEsportesService.createUsuarioEsporte(req.body);
  res.status(201).json(UsuarioEsportesService.toPublicUsuarioEsporte(registro));
};

export const getAllUsuarioEsportes = async (req: Request, res: Response) => {
  const { usuarioId, esporteId } = req.query as { usuarioId?: string; esporteId?: string };
  const lista = await UsuarioEsportesService.getAllUsuarioEsportes({ usuarioId, esporteId });
  res.json(lista.map(UsuarioEsportesService.toPublicUsuarioEsporte));
};

export const getUsuarioEsporteById = async (req: Request, res: Response) => {
  const registro = await UsuarioEsportesService.getUsuarioEsporteById(readId(req));
  res.json(UsuarioEsportesService.toPublicUsuarioEsporte(registro));
};

export const updateUsuarioEsporte = async (req: Request, res: Response) => {
  const registro = await UsuarioEsportesService.updateUsuarioEsporte(readId(req), req.body);
  res.json(UsuarioEsportesService.toPublicUsuarioEsporte(registro));
};

export const deleteUsuarioEsporte = async (req: Request, res: Response) => {
  await UsuarioEsportesService.deleteUsuarioEsporte(readId(req));
  res.status(204).send();
};