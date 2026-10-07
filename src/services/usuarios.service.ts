import bcrypt from 'bcryptjs';
import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export interface CreateUsuarioInput {
  nome: string;
  sobrenome: string;
  username: string;
  email: string;
  senha: string; // texto puro que chega na API; vira senhaHash no banco
  fotoPerfilUrl?: string | null;
  cidade?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bio?: string | null;
}

export type UpdateUsuarioInput = Partial<CreateUsuarioInput>;
type UsuarioRow = Awaited<ReturnType<typeof db.orm.public.Usuarios.create>>;
type UsuarioChanges = Partial<Omit<UsuarioRow, 'id' | 'createdAt'>>;

const toBigInt = (id: number) => BigInt(id);
const num = (valor: unknown) => (valor === null || valor === undefined ? null : Number(valor));

// Nunca devolve senhaHash. id é bigint, então vai como string no JSON.
export const toPublicUsuario = (u: UsuarioRow) => ({
  id: String(u.id),
  nome: u.nome,
  sobrenome: u.sobrenome,
  username: u.username,
  email: u.email,
  fotoPerfilUrl: u.fotoPerfilUrl,
  cidade: u.cidade,
  latitude: num(u.latitude),
  longitude: num(u.longitude),
  bio: u.bio,
  createdAt: u.createdAt,
});

async function garantirUnicos(data: { email?: string; username?: string }, idAtual?: number) {
  if (data.email !== undefined) {
    const existente = await db.orm.public.Usuarios.first({ email: data.email as UsuarioRow['email'] });
    if (existente && existente.id !== (idAtual === undefined ? undefined : toBigInt(idAtual))) {
      throw new HttpError(409, 'Email já cadastrado.');
    }
  }
  if (data.username !== undefined) {
    const existente = await db.orm.public.Usuarios.first({ username: data.username as UsuarioRow['username'] });
    if (existente && existente.id !== (idAtual === undefined ? undefined : toBigInt(idAtual))) {
      throw new HttpError(409, 'Username já cadastrado.');
    }
  }
}

export async function createUsuario(data: CreateUsuarioInput) {
  await garantirUnicos({ email: data.email, username: data.username });

  return db.orm.public.Usuarios.create({
    nome: data.nome as UsuarioRow['nome'],
    sobrenome: data.sobrenome as UsuarioRow['sobrenome'],
    username: data.username as UsuarioRow['username'],
    email: data.email as UsuarioRow['email'],
    senhaHash: (await bcrypt.hash(data.senha, 10)) as UsuarioRow['senhaHash'],
    fotoPerfilUrl: (data.fotoPerfilUrl ?? null) as UsuarioRow['fotoPerfilUrl'],
    cidade: (data.cidade ?? null) as UsuarioRow['cidade'],
    latitude: (data.latitude ?? null) as unknown as UsuarioRow['latitude'],
    longitude: (data.longitude ?? null) as unknown as UsuarioRow['longitude'],
    bio: data.bio ?? null,
  });
}

export async function getAllUsuarios() {
  return db.orm.public.Usuarios.all();
}

export async function getUsuarioById(id: number) {
  const usuario = await db.orm.public.Usuarios.first({ id: toBigInt(id) });
  if (!usuario) throw new HttpError(404, 'Usuário não encontrado.');
  return usuario;
}

export async function updateUsuario(id: number, data: UpdateUsuarioInput) {
  await garantirUnicos({ email: data.email, username: data.username }, id);

  const changes: UsuarioChanges = {};
  if (data.nome !== undefined) changes.nome = data.nome as UsuarioRow['nome'];
  if (data.sobrenome !== undefined) changes.sobrenome = data.sobrenome as UsuarioRow['sobrenome'];
  if (data.username !== undefined) changes.username = data.username as UsuarioRow['username'];
  if (data.email !== undefined) changes.email = data.email as UsuarioRow['email'];
  if (data.senha !== undefined) changes.senhaHash = (await bcrypt.hash(data.senha, 10)) as UsuarioRow['senhaHash'];
  if (data.fotoPerfilUrl !== undefined) changes.fotoPerfilUrl = data.fotoPerfilUrl as UsuarioRow['fotoPerfilUrl'];
  if (data.cidade !== undefined) changes.cidade = data.cidade as UsuarioRow['cidade'];
  if (data.latitude !== undefined) changes.latitude = data.latitude as unknown as UsuarioRow['latitude'];
  if (data.longitude !== undefined) changes.longitude = data.longitude as unknown as UsuarioRow['longitude'];
  if (data.bio !== undefined) changes.bio = data.bio;

  if (Object.keys(changes).length === 0) throw new HttpError(400, 'Informe pelo menos um campo.');
  const usuario = await db.orm.public.Usuarios.where({ id: toBigInt(id) }).update(changes);
  if (!usuario) throw new HttpError(404, 'Usuário não encontrado.');
  return usuario;
}

export async function deleteUsuario(id: number) {
  const usuario = await db.orm.public.Usuarios.where({ id: toBigInt(id) }).delete();
  if (!usuario) throw new HttpError(404, 'Usuário não encontrado.');
}