// Arquivo: tests/api.integration.test.ts
import { afterAll, expect, it } from 'vitest';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { app } from '../src/app.js';
import { db } from '../src/prisma/db.js';

const ROTA_USUARIOS = '/usuarios';
const ROTA_LOGIN = '/login';

const emails: string[] = [];

afterAll(async () => {
  try {
    for (const email of emails) {
      // email é Varchar<255> no contrato; a conversão evita o erro de tipo TS2769.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const usuario = await db.orm.public.Usuarios.first({ email: email as any });
      // O onDelete: Cascade do contrato remove também anúncios, publicações, etc.
      if (usuario) await db.orm.public.Usuarios.where({ id: usuario.id }).delete();
    }
  } finally {
    await db.close();
  }
});

function novoUsuario() {
  const sufixo = randomUUID().replace(/-/g, '').slice(0, 12);
  return {
    email: `integracao-${randomUUID()}@example.com`,
    // username tem limite de 30 caracteres e é único
    username: `it_${sufixo}`,
    nome: 'Pessoa',
    sobrenome: 'Integração',
    // O cadastro recebe "senha"; o login recebe "password".
    senha: 'Integracao123!',
  };
}

it('cadastro → banco → login → autorização → atualização → exclusão', async () => {
  const dados = novoUsuario();
  const outro = novoUsuario();
  emails.push(dados.email, outro.email);

  // Cadastro
  const criado = await request(app).post(ROTA_USUARIOS).send(dados);
  expect(criado.status).toBe(201);
  expect(criado.body).not.toHaveProperty('senha');
  expect(criado.body).not.toHaveProperty('senhaHash');
  expect(criado.body).not.toHaveProperty('password');

  // O id é BigInt no banco; na resposta JSON costuma chegar como string ou número.
  const id = criado.body.id;
  const idDb = BigInt(id);

  // Conferência no banco: a senha precisa estar guardada como hash
  const guardado = await db.orm.public.Usuarios.first({ id: idDb });
  expect(guardado).not.toBeNull();
  expect(guardado!.senhaHash).not.toBe(dados.senha);
  expect(await bcrypt.compare(dados.senha, guardado!.senhaHash)).toBe(true);

  // Duplicidade (mesmo e-mail e username) → 409
  expect((await request(app).post(ROTA_USUARIOS).send(dados)).status).toBe(409);

  // Segundo usuário, para testar autorização
  const segundo = await request(app).post(ROTA_USUARIOS).send(outro);
  expect(segundo.status).toBe(201);

  // Login (a API espera "password")
  const login = await request(app)
    .post(ROTA_LOGIN)
    .send({ email: dados.email, password: dados.senha });
  expect(login.status).toBe(200);
  const auth = `Bearer ${login.body.token}`;

  // Listagem: vale se a sua listagem devolve só o próprio usuário.
  const lista = await request(app).get(ROTA_USUARIOS).set('Authorization', auth);
  expect(lista.status).toBe(200);
  expect(lista.body.map((u: { id: string | number }) => String(u.id))).toEqual([String(id)]);

  // Autorização: não pode ver outro usuário
  const proibido = await request(app)
    .get(`${ROTA_USUARIOS}/${segundo.body.id}`)
    .set('Authorization', auth);
  expect(proibido.status).toBe(403);

  // Atualização com e-mail já usado → 409
  const conflito = await request(app)
    .put(`${ROTA_USUARIOS}/${id}`)
    .set('Authorization', auth)
    .send({ email: outro.email });
  expect(conflito.status).toBe(409);

  // Atualização válida
  const atualizado = await request(app)
    .put(`${ROTA_USUARIOS}/${id}`)
    .set('Authorization', auth)
    .send({ nome: 'Nome Atualizado' });
  expect(atualizado.status).toBe(200);
  expect(atualizado.body.nome).toBe('Nome Atualizado');
  expect(atualizado.body).not.toHaveProperty('senhaHash');
  expect(atualizado.body).not.toHaveProperty('password');

  // Exclusão
  const exclusao = await request(app).delete(`${ROTA_USUARIOS}/${id}`).set('Authorization', auth);
  expect(exclusao.status).toBe(204);
  expect(await db.orm.public.Usuarios.first({ id: idDb })).toBeNull();
});