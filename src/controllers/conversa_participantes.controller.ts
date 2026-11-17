import type { Request, Response } from 'express';
import * as ConversaParticipantesService from '../services/conversa_participantes.service.js';
import { HttpError } from '../lib/http-error.js';

const readPositiveId = (value: unknown, campo: string) => {
  const numero = Number(value);

  if (!Number.isSafeInteger(numero) || numero <= 0) {
    throw new HttpError(
      400,
      `${campo} deve ser um inteiro positivo válido.`
    );
  }

  return numero;
};

const readPositiveInt = (value: unknown, padrao: number) => {
  if (value === undefined) return padrao;

  const numero = Number(value);

  if (!Number.isSafeInteger(numero) || numero < 0) {
    throw new HttpError(
      400,
      'Parâmetro de paginação inválido.'
    );
  }

  return numero;
};

export const createConversaParticipantes = async (
  req: Request,
  res: Response
) => {
  const body = req.body ?? {};

  const participantes =
    await ConversaParticipantesService.createConversaParticipantes({
      conversaId: readPositiveId(
        body.conversaId,
        'conversaId'
      ),
      usuarioId: readPositiveId(
        body.usuarioId,
        'usuarioId'
      ),
    });

  res
    .status(201)
    .json(
      ConversaParticipantesService.toPublicConversaParticipantes(
        participantes
      )
    );
};

export const getAllConversaParticipantes = async (
  req: Request,
  res: Response
) => {
  const limit = readPositiveInt(
    req.query.limit,
    20
  );

  const offset = readPositiveInt(
    req.query.offset,
    0
  );

  const conversaId =
    req.query.conversaId === undefined
      ? undefined
      : readPositiveId(
          req.query.conversaId,
          'conversaId'
        );

  const usuarioId =
    req.query.usuarioId === undefined
      ? undefined
      : readPositiveId(
          req.query.usuarioId,
          'usuarioId'
        );

  const lista =
    await ConversaParticipantesService.getAllConversaParticipantes(
      limit,
      offset,
      conversaId,
      usuarioId
    );

  res.json(
    lista.map(
      ConversaParticipantesService.toPublicConversaParticipantes
    )
  );
};

export const getConversaParticipantesById = async (
  req: Request,
  res: Response
) => {
  const participantes =
    await ConversaParticipantesService.getConversaParticipantesById(
      readPositiveId(req.params.id, 'id')
    );

  res.json(
    ConversaParticipantesService.toPublicConversaParticipantes(
      participantes
    )
  );
};

export const deleteConversaParticipantes = async (
  req: Request,
  res: Response
) => {
  await ConversaParticipantesService.deleteConversaParticipantes(
    readPositiveId(req.params.id, 'id')
  );

  res.status(204).send();
};