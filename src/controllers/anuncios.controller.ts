import type { Request, Response } from 'express';
import * as AnunciosService from '../services/anuncios.service.js';
import { HttpError } from '../lib/http-error.js';

const MAX_BIGINT = 9223372036854775807n;
const MAX_INT = 2147483647;

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

const readInt = (value: unknown, campo: string) => {
  const texto = String(value ?? '');
  const numero = Number(texto);
  if (!/^\d+$/.test(texto) || !Number.isSafeInteger(numero) || numero < 1 || numero > MAX_INT) {
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

const readString = (value: unknown, campo: string, max: number) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${campo} obrigatório.`);
  }
  const limpo = value.trim();
  if (limpo.length > max) {
    throw new HttpError(400, `${campo} deve ter no máximo ${max} caracteres.`);
  }
  return limpo;
};

const readOptionalString = (value: unknown, campo: string, max: number) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return readString(value, campo, max);
};

const readEnum = <T extends string>(value: unknown, campo: string, permitidos: readonly T[]) => {
  if (typeof value !== 'string' || !permitidos.includes(value as T)) {
    throw new HttpError(400, `${campo} deve ser um de: ${permitidos.join(', ')}.`);
  }
  return value as T;
};

const readPreco = (value: unknown) => {
  const texto = String(value ?? '');
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(texto)) {
    throw new HttpError(400, 'Preço deve ser maior ou igual a zero, com até 8 dígitos inteiros e 2 casas decimais.');
  }
  return texto;
};

const readCoordenada = (value: unknown, campo: string, limite: number) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const texto = String(value);
  const numero = Number(texto);
  if (!/^-?\d+(\.\d{1,6})?$/.test(texto) || !Number.isFinite(numero) || Math.abs(numero) > limite) {
    throw new HttpError(400, `${campo} deve estar entre -${limite} e ${limite}, com até 6 casas decimais.`);
  }
  return texto;
};

const lerCoordenadas = (body: Record<string, unknown>) => {
  const latitude = readCoordenada(body.latitude, 'Latitude', 90);
  const longitude = readCoordenada(body.longitude, 'Longitude', 180);
  const temLat = latitude !== undefined && latitude !== null;
  const temLng = longitude !== undefined && longitude !== null;
  if (temLat !== temLng) {
    throw new HttpError(400, 'Latitude e longitude devem ser informadas juntas.');
  }
  return { latitude, longitude };
};

// Id do usuário logado, preenchido pelo middleware authenticate em req.user.id
// (provisório, via header x-user-id — ver src/middlewares/authenticate.ts).
const readUsuarioLogado = (req: Request) => {
  const user = (req as Request & { user?: { id: string } }).user;
  if (!user) throw new HttpError(401, 'Não autenticado.');
  return readBigInt(user.id, 'usuarioId');
};

export const createAnuncios = async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const { latitude, longitude } = lerCoordenadas(body);

  const anuncios = await AnunciosService.createAnuncios({
    usuarioId: readUsuarioLogado(req),
    titulo: readString(body.titulo, 'Título', 150),
    descricao: body.descricao === undefined || body.descricao === null ? null : String(body.descricao),
    preco: readPreco(body.preco),
    esporteId: body.esporteId === undefined || body.esporteId === null ? null : readInt(body.esporteId, 'esporteId'),
    condicao: readEnum(body.condicao, 'Condição', AnunciosService.CONDICOES),
    latitude: latitude ?? null,
    longitude: longitude ?? null,
    cidade: readOptionalString(body.cidade, 'Cidade', 100) ?? null
  });

  res.status(201).json(AnunciosService.toPublicAnuncios(anuncios));
};

export const getAllAnuncios = async (req: Request, res: Response) => {
  const { esporteId, cidade, status } = req.query;

  const lista = await AnunciosService.getAllAnuncios({
    esporteId: esporteId === undefined ? undefined : readInt(esporteId, 'esporteId'),
    cidade: cidade === undefined ? undefined : readString(cidade, 'Cidade', 100),
    status: status === undefined ? undefined : readEnum(status, 'Status', AnunciosService.STATUS),
    limit: readPositiveInt(req.query.limit, 20),
    offset: readPositiveInt(req.query.offset, 0)
  });

  res.json(lista.map(AnunciosService.toPublicAnuncios));
};

export const getAnunciosById = async (req: Request, res: Response) => {
  const anuncios = await AnunciosService.getAnunciosById(readBigInt(req.params.id, 'id'));
  res.json(AnunciosService.toPublicAnuncios(anuncios));
};

export const updateAnuncios = async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const changes: AnunciosService.UpdateAnunciosInput = {};

  if (body.titulo !== undefined) changes.titulo = readString(body.titulo, 'Título', 150);
  if (body.descricao !== undefined) {
    changes.descricao = body.descricao === null ? null : String(body.descricao);
  }
  if (body.preco !== undefined) changes.preco = readPreco(body.preco);
  if (body.esporteId !== undefined) {
    changes.esporteId = body.esporteId === null ? null : readInt(body.esporteId, 'esporteId');
  }
  if (body.condicao !== undefined) {
    changes.condicao = readEnum(body.condicao, 'Condição', AnunciosService.CONDICOES);
  }
  if (body.status !== undefined) {
    changes.status = readEnum(body.status, 'Status', AnunciosService.STATUS);
  }
  if (body.cidade !== undefined) changes.cidade = readOptionalString(body.cidade, 'Cidade', 100);

  if (body.latitude !== undefined || body.longitude !== undefined) {
    const { latitude, longitude } = lerCoordenadas(body);
    changes.latitude = latitude;
    changes.longitude = longitude;
  }

  const anuncios = await AnunciosService.updateAnuncios(
    readBigInt(req.params.id, 'id'),
    readUsuarioLogado(req),
    changes
  );
  res.json(AnunciosService.toPublicAnuncios(anuncios));
};

// Exclusão lógica (status = 'removido'), só pelo dono do anúncio.
export const removerAnuncios = async (req: Request, res: Response) => {
  await AnunciosService.removerAnuncios(readBigInt(req.params.id, 'id'), readUsuarioLogado(req));
  res.status(204).send();
};