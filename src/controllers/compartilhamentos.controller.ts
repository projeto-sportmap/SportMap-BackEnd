import type { Request, Response } from 'express';
import * as CompartilhamentosService from '../services/compartilhamentos.service.js';
import { HttpError } from '../lib/http-error.js';

const MAX_BIGINT = 9223372036854775807n;

const readBigInt = (value: unknown, campo: string) => {
  const texto = String(value ?? '');
   if (!/^\d+$/.test(texto)) {
     throw new HttpError(400, `${campo} deve ser um inteiro positivo válido.`);
   }
  const numero = BigInt(texto);
  if (numero < 1n || numero > MAX_BIGINT) {
     throw new HttpError(400, `${campo} deve ser um inteiro positivo válido.`);
   }
  return numero;
};

const readPositiveInt = (value: unknown, padrao: number) => {
  if (value === undefined) return padrao;
    const numero = Number(value);
  if (!Number.isSafeInteger(numero) || numero < 0) {
     throw new HttpError(400, 'Parâmetro de paginação inválido.');
  }
  return numero;
};

export const createCompartilhamentos = async (req: Request, res: Response) => {
  const { publicacaoId, usuarioId } = req.body ?? {};

  const compartilhamentos = await CompartilhamentosService.createCompartilhamentos({
     publicacaoId: readBigInt(publicacaoId, 'publicacaoId'),
     usuarioId: readBigInt(usuarioId, 'usuarioId')
  });
  res.status(201).json(CompartilhamentosService.toPublicCompartilhamentos(compartilhamentos));
};

export const getAllCompartilhamentos = async (req: Request, res: Response) => {
   const limit = readPositiveInt(req.query.limit, 20);
   const offset = readPositiveInt(req.query.offset, 0);
   const lista = await CompartilhamentosService.getAllCompartilhamentos(limit, offset);
   res.json(lista.map(CompartilhamentosService.toPublicCompartilhamentos));
};

export const getCompartilhamentosById = async (req: Request, res: Response) => {
   const compartilhamentos = await CompartilhamentosService.getCompartilhamentosById(
      readBigInt(req.params.id, 'id')
  );
  res.json(CompartilhamentosService.toPublicCompartilhamentos(compartilhamentos));
};

export const deleteCompartilhamentos = async (req: Request, res: Response) => {
   await CompartilhamentosService.deleteCompartilhamentos(readBigInt(req.params.id, 'id'));
   res.status(204).send();
};