import type { Request, Response } from 'express';
import * as CurtidasService from '../services/curtidas.service.js';
import { HttpError } from '../lib/http-error.js';
import { db } from '../prisma/db.js';
import { publishNotification } from '../services/notificationHub.js';

const readId = (req: Request) => {
  const value = String(req.params.id);
  const id = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(400, 'ID deve ser um inteiro positivo válido.');
  }
  return id;
};

export const createCurtida = async (req: Request, res: Response) => {
  const usuarioId = String(res.locals.userId);
  if (req.body.usuarioId !== usuarioId) {
    throw new HttpError(403, 'A curtida deve usar o usuário autenticado.');
  }
  const curtida = await CurtidasService.createCurtida({
    ...req.body,
    usuarioId,
  });
  try {
    const publicacao = await db.orm.public.Publicacoes.first({ id: BigInt(curtida.publicacaoId) });
    const usuario = res.locals.usuario as { id: bigint; nome: string; sobrenome?: string | null; username?: string };
    if (publicacao && String(publicacao.usuarioId) !== usuarioId) {
      publishNotification(String(publicacao.usuarioId), {
        type: 'like',
        actorName: [usuario.nome, usuario.sobrenome].filter(Boolean).join(' '),
        actorUsername: usuario.username,
        resourceId: String(curtida.publicacaoId),
        createdAt: new Date(curtida.createdAt).toISOString(),
      }, `like-${curtida.id}`);
    }
  } catch {
    // A notification failure must not undo a successful like.
  }
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
  await CurtidasService.deleteCurtida(readId(req), BigInt(res.locals.userId));
  res.status(204).send();
};
