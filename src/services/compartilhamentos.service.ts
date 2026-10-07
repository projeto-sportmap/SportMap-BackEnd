import { db } from '../prisma/db.js';
import { HttpError } from '../lib/http-error.js';

export interface CreateCompartilhamentosInput {
  publicacaoId: bigint;
  usuarioId: bigint;
}

type CompartilhamentosRow = Awaited<ReturnType<typeof db.orm.public.Compartilhamentos.create>>;

export const toPublicCompartilhamentos = (compartilhamentos: CompartilhamentosRow) => ({
  id: compartilhamentos.id.toString(),
  publicacaoId: compartilhamentos.publicacaoId.toString(),
  usuarioId: compartilhamentos.usuarioId.toString(),
  createdAt: compartilhamentos.createdAt
});

export async function createCompartilhamentos(data: CreateCompartilhamentosInput) {
  const [publicacao, usuario] = await Promise.all([
    db.orm.public.Publicacoes.first({ id: data.publicacaoId }),
    db.orm.public.Usuarios.first({ id: data.usuarioId })
  ]);
  if (!publicacao) throw new HttpError(404, 'Publicação não encontrada.');
  if (!usuario) throw new HttpError(404, 'Usuário não encontrado.');

  return db.orm.public.Compartilhamentos.create({
    publicacaoId: data.publicacaoId,
    usuarioId: data.usuarioId
  });
}

export async function getAllCompartilhamentos(limit = 20, offset = 0) {
  const take = Math.min(Math.max(limit, 1), 100);
  const skip = Math.max(offset, 0);
  const resultado: CompartilhamentosRow[] = [];
  let indice = 0;

  for await (const compartilhamento of db.orm.public.Compartilhamentos.all()) {
     if (indice >= skip + take) break;
     if (indice >= skip) resultado.push(compartilhamento);
     indice++;
   }
  return resultado;
}

export async function getCompartilhamentosById(id: bigint) {
  const compartilhamentos = await db.orm.public.Compartilhamentos.first({ id });
  if (!compartilhamentos) throw new HttpError(404, 'Compartilhamento não encontrado.');
  return compartilhamentos;
}

export async function deleteCompartilhamentos(id: bigint) {
  const compartilhamentos = await db.orm.public.Compartilhamentos.where({ id }).delete();
  if (!compartilhamentos) throw new HttpError(404, 'Compartilhamento não encontrado.');
}