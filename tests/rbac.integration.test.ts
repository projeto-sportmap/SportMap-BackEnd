// Arquivo: tests/rbac.integration.test.ts
import { afterAll, expect, it } from 'vitest';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { app } from '../src/app.js';
import { db } from '../src/prisma/db.js';
import { env } from '../src/config/env.js';
import { hasPermission } from '../src/security/permissions.js';

type UsuarioRow = Awaited<ReturnType<typeof db.orm.public.Usuarios.create>>;
type TipoRow = Awaited<ReturnType<typeof db.orm.public.TipoUsuario.create>>;

const emails: string[] = [];

afterAll(async () => {
  try {
    for (const email of emails) {
      const usuario = await db.orm.public.Usuarios.first({ email: email as UsuarioRow['email'] });
      if (usuario) await db.orm.public.Usuarios.where({ id: usuario.id }).delete();
    }
  } finally {
    await db.close();
  }
});

function novoUsuario(nome: string) {
  const sufixo = randomUUID().replace(/-/g, '').slice(0, 12);
  return {
    email: `rbac-${randomUUID()}@example.com`,
    username: `rbac_${sufixo}`,
    nome,
    sobrenome: 'RBAC',
    senha: 'Estudo123!',
  };
}

it('RBAC: padrão seguro, permissão atual e proteção contra promoção pública', async () => {
  const aluno = await db.orm.public.TipoUsuario.first({ code: 'USUARIO' as TipoRow['code'] });
  const admin = await db.orm.public.TipoUsuario.first({ code: 'ADMIN' as TipoRow['code'] });
  expect(aluno?.id).toBe(1);
  expect(admin?.id).toBe(2);
  expect(hasPermission('DESCONHECIDO', 'usuarios:read:any')).toBe(false);
  expect(hasPermission('__proto__', 'usuarios:read:any')).toBe(false);

  const data = novoUsuario('Aluna');
  const other = novoUsuario('Admin');
  emails.push(data.email, other.email);

  // Campos de privilégio enviados no cadastro são descartados pelo schema:
  // a conta nasce USUARIO (tipo 1) de qualquer forma.
  const tentativa = { ...novoUsuario('Fraude'), tipoUsuarioId: 2, role: 'ADMIN', code: 'ADMIN' };
  emails.push(tentativa.email);
  const fraude = await request(app).post('/usuarios').send(tentativa);
  expect(fraude.status).toBe(201);
  expect((await db.orm.public.Usuarios.first({ id: BigInt(fraude.body.id) }))?.tipoUsuarioId).toBe(1);

  const created = await request(app).post('/usuarios').send(data);
  const second = await request(app).post('/usuarios').send(other);
  expect(created.status).toBe(201);
  expect(second.status).toBe(201);
  const id = created.body.id as string;
  const adminId = BigInt(second.body.id);
  expect((await db.orm.public.Usuarios.first({ id: BigInt(id) }))?.tipoUsuarioId).toBe(1);

  const login = await request(app).post('/login').send({ email: data.email, password: data.senha });
  const otherLogin = await request(app).post('/login').send({ email: other.email, password: other.senha });
  expect(login.status).toBe(200);
  expect(otherLogin.status).toBe(200);
  const auth = `Bearer ${login.body.token}`;
  const otherAuth = `Bearer ${otherLogin.body.token}`;
  const path = `/admin/usuarios/${id}`;

  expect((await request(app).get(path)).status).toBe(401);
  expect((await request(app).get(path).set('Authorization', 'Bearer invalido')).status).toBe(401);
  expect((await request(app).get(path).set('Authorization', auth)).status).toBe(403);

  // Mesmo um papel extra num JWT assinado não substitui o papel do banco.
  const extraRole = jwt.sign({ id, role: 'ADMIN' }, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '15m',
    issuer: 'sportmap-api',
    audience: 'sportmap',
  });
  expect((await request(app).get(path).set('Authorization', `Bearer ${extraRole}`)).status).toBe(403);

  // Promoção feita direto no banco (equivale ao script set-user-role).
  await db.orm.public.Usuarios.where({ id: adminId }).update({ tipoUsuarioId: admin!.id });
  const allowed = await request(app).get(path).set('Authorization', otherAuth);
  expect(allowed.status).toBe(200);
  expect(String(allowed.body.id)).toBe(id);
  expect(allowed.body).not.toHaveProperty('senhaHash');
  expect((await request(app).get(path).set('Cookie', `token=${otherLogin.body.token}`)).status).toBe(200);

  // Rotas pessoais continuam só para a própria conta, inclusive para ADMIN.
  expect((await request(app).get(`/usuarios/${id}`).set('Authorization', otherAuth)).status).toBe(403);
  expect((await request(app).put(`/usuarios/${id}`).set('Authorization', otherAuth).send({ nome: 'Outro' })).status).toBe(403);
  expect((await request(app).delete(`/usuarios/${id}`).set('Authorization', otherAuth)).status).toBe(403);

  // Editar a própria conta não consegue mudar o tipo (campo descartado).
  expect((await request(app).put(`/usuarios/${id}`).set('Authorization', auth).send({ tipoUsuarioId: 2 })).status).toBe(400);
  expect((await request(app).put(`/usuarios/${id}`).set('Authorization', auth).send({ nome: 'Aluna Nova', tipoUsuarioId: 2 })).status).toBe(200);
  expect((await db.orm.public.Usuarios.first({ id: BigInt(id) }))?.tipoUsuarioId).toBe(1);

  expect((await request(app).get('/admin/usuarios/abc').set('Authorization', otherAuth)).status).toBe(400);
  expect((await request(app).get('/admin/usuarios/2147483647').set('Authorization', otherAuth)).status).toBe(404);

  // Retirar o privilégio bloqueia o mesmo token no pedido seguinte.
  await db.orm.public.Usuarios.where({ id: adminId }).update({ tipoUsuarioId: aluno!.id });
  expect((await request(app).get(path).set('Authorization', otherAuth)).status).toBe(403);

  // Conta removida: o mesmo token passa a receber 401.
  await db.orm.public.Usuarios.where({ id: adminId }).delete();
  expect((await request(app).get(path).set('Authorization', otherAuth)).status).toBe(401);
});