import type { Request, Response } from 'express';
import * as UsuariosService from '../services/usuarios.service.js';
import { HttpError } from '../lib/http-error.js';

const readId = (req: Request) => {
  const value = String(req.params.id);
  const id = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(400, 'ID deve ser um inteiro positivo válido.');
  }
  return id;
};

const textoObrigatorio = (valor: unknown, campo: string, max: number) => {
  if (typeof valor !== 'string' || !valor.trim()) throw new HttpError(400, `${campo} obrigatório.`);
  const limpo = valor.trim();
  if (limpo.length > max) throw new HttpError(400, `${campo} deve ter no máximo ${max} caracteres.`);
  return limpo;
};

// Aceita string, null (limpar o campo) ou undefined (não enviado)
const textoOpcional = (valor: unknown, campo: string, max: number) => {
  if (valor === undefined) return undefined;
  if (valor === null) return null;
  if (typeof valor !== 'string') throw new HttpError(400, `${campo} deve ser texto.`);
  const limpo = valor.trim();
  if (!limpo) return null;
  if (limpo.length > max) throw new HttpError(400, `${campo} deve ter no máximo ${max} caracteres.`);
  return limpo;
};

const validarUsername = (valor: unknown) => {
  const username = textoObrigatorio(valor, 'Username', 30).toLowerCase();
  if (!/^[a-z0-9_.]+$/.test(username)) {
    throw new HttpError(400, 'Username só pode ter letras, números, "_" e ".".');
  }
  return username;
};

const validarEmail = (valor: unknown) => {
  const email = textoObrigatorio(valor, 'Email', 255).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Email inválido.');
  return email;
};

const validarSenha = (valor: unknown) => {
  if (typeof valor !== 'string' || valor.length < 6) {
    throw new HttpError(400, 'Senha deve ter no mínimo 6 caracteres.');
  }
  if (valor.length > 72) throw new HttpError(400, 'Senha deve ter no máximo 72 caracteres.');
  return valor;
};

const validarCoordenada = (valor: unknown, campo: string, limite: number) => {
  if (typeof valor !== 'number' || !Number.isFinite(valor) || valor < -limite || valor > limite) {
    throw new HttpError(400, `${campo} deve ser um número entre -${limite} e ${limite}.`);
  }
  return valor;
};

// Retorna undefined (não enviou), ou { latitude, longitude } (ambos número ou ambos null)
const lerCoordenadas = (body: Record<string, unknown>) => {
  const { latitude, longitude } = body;
  if (latitude === undefined && longitude === undefined) return undefined;
  if (latitude === undefined || longitude === undefined) {
    throw new HttpError(400, 'Informe latitude e longitude juntas.');
  }
  if (latitude === null && longitude === null) return { latitude: null, longitude: null };
  if (latitude === null || longitude === null) {
    throw new HttpError(400, 'Latitude e longitude devem ser ambas preenchidas ou ambas nulas.');
  }
  return {
    latitude: validarCoordenada(latitude, 'Latitude', 90),
    longitude: validarCoordenada(longitude, 'Longitude', 180),
  };
};

export const createUsuario = async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const coords = lerCoordenadas(body);

  const usuario = await UsuariosService.createUsuario({
    nome: textoObrigatorio(body.nome, 'Nome', 100),
    sobrenome: textoObrigatorio(body.sobrenome, 'Sobrenome', 100),
    username: validarUsername(body.username),
    email: validarEmail(body.email),
    senha: validarSenha(body.senha),
    fotoPerfilUrl: textoOpcional(body.fotoPerfilUrl, 'Foto de perfil', 500),
    cidade: textoOpcional(body.cidade, 'Cidade', 100),
    bio: textoOpcional(body.bio, 'Bio', 1000),
    ...(coords ?? {}),
  });
  res.status(201).json(UsuariosService.toPublicUsuario(usuario));
};

export const getAllUsuarios = async (_req: Request, res: Response) => {
  res.json((await UsuariosService.getAllUsuarios()).map(UsuariosService.toPublicUsuario));
};

export const getUsuarioById = async (req: Request, res: Response) => {
  res.json(UsuariosService.toPublicUsuario(await UsuariosService.getUsuarioById(readId(req))));
};

export const updateUsuario = async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const changes: UsuariosService.UpdateUsuarioInput = {};

  if (body.nome !== undefined) changes.nome = textoObrigatorio(body.nome, 'Nome', 100);
  if (body.sobrenome !== undefined) changes.sobrenome = textoObrigatorio(body.sobrenome, 'Sobrenome', 100);
  if (body.username !== undefined) changes.username = validarUsername(body.username);
  if (body.email !== undefined) changes.email = validarEmail(body.email);
  if (body.senha !== undefined) changes.senha = validarSenha(body.senha);

  const foto = textoOpcional(body.fotoPerfilUrl, 'Foto de perfil', 500);
  if (foto !== undefined) changes.fotoPerfilUrl = foto;
  const cidade = textoOpcional(body.cidade, 'Cidade', 100);
  if (cidade !== undefined) changes.cidade = cidade;
  const bio = textoOpcional(body.bio, 'Bio', 1000);
  if (bio !== undefined) changes.bio = bio;

  const coords = lerCoordenadas(body);
  if (coords) Object.assign(changes, coords);

  res.json(UsuariosService.toPublicUsuario(await UsuariosService.updateUsuario(readId(req), changes)));
};

export const deleteUsuario = async (req: Request, res: Response) => {
  await UsuariosService.deleteUsuario(readId(req));
  res.status(204).send();
};
export const updateLocalizacao = async (req: Request, res: Response) => {
  const { latitude, longitude } = req.body as { latitude: number; longitude: number };
  const usuario = await UsuariosService.updateUsuario(readId(req), {
    latitude: Number(latitude.toFixed(6)),
    longitude: Number(longitude.toFixed(6)),
  });
  res.json(UsuariosService.toPublicUsuario(usuario));
};
export const updateFoto = async (req: Request, res: Response) => {
  if (!req.file) throw new HttpError(400, 'Envie uma foto no campo "foto".');
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  const usuario = await UsuariosService.updateUsuario(readId(req), { fotoPerfilUrl: url });
  res.json(UsuariosService.toPublicUsuario(usuario));
};