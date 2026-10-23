// Arquivo: src/controllers/comentarios.controller.ts
import type { Request, Response } from 'express';
import * as ComentariosService from '../services/comentarios.service.js';
import { HttpError } from '../lib/http-error.js';

const MAX_BIGINT = BigInt('9223372036854775807'); // limite do bigint do Postgres

const readId = (req: Request, name: 'id' | 'publicacaoId' = 'id'): string => {
  const value = String(req.params[name]);

  if (!/^[1-9]\d*$/.test(value) || BigInt(value) > MAX_BIGINT) {
    throw new HttpError(400, 'ID deve ser um inteiro positivo válido.');
  }
  return value;
};

// O authMiddleware coloca o id do usuário em res.locals.userId
const readUsuarioId = (res: Response): string => {
  const usuarioId = res.locals.userId;
  if (usuarioId === undefined || usuarioId === null) {
    throw new HttpError(401, 'Usuário não autenticado.');
  }
  return String(usuarioId);
};

export async function createComentario(req: Request, res: Response) {
  const publicacaoId = readId(req, 'publicacaoId');
  const usuarioId = readUsuarioId(res);
  const comentario = await ComentariosService.createComentario(
    publicacaoId,
    usuarioId,
    req.body,
  );
  res.status(201).json(comentario);
}

export async function getComentariosByPublicacao(req: Request, res: Response) {
  const publicacaoId = readId(req, 'publicacaoId');
  const comentarios = await ComentariosService.getComentariosByPublicacao(publicacaoId);
  res.status(200).json(comentarios);
}

export async function getComentarioById(req: Request, res: Response) {
  const id = readId(req);
  const comentario = await ComentariosService.getComentarioById(id);
  res.status(200).json(comentario);
}

export async function updateComentario(req: Request, res: Response) {
  const id = readId(req);
  const usuarioId = readUsuarioId(res);
  const comentario = await ComentariosService.updateComentario(id, usuarioId, req.body);
  res.status(200).json(comentario);
}

export async function deleteComentario(req: Request, res: Response) {
  const id = readId(req);
  const usuarioId = readUsuarioId(res);
  await ComentariosService.deleteComentario(id, usuarioId);
  res.status(204).send();
}