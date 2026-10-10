import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

const mocks = vi.hoisted(() => ({
  createEsporte: vi.fn(),
  getAllEsportes: vi.fn(),
  getEsporteById: vi.fn(),
  updateEsporte: vi.fn(),
  deleteEsporte: vi.fn(),
  toPublicEsporte: vi.fn((esporte: any) => ({ nome: esporte.nome })),
  createUsuario: vi.fn(),
  getUsuarioById: vi.fn(),
  updateUsuario: vi.fn(),
  deleteUsuario: vi.fn(),
  toPublicUsuario: vi.fn((usuario: any) => ({
    id: String(usuario.id),
    nome: usuario.nome,
    sobrenome: usuario.sobrenome,
    username: usuario.username,
    email: usuario.email,
    fotoPerfilUrl: usuario.fotoPerfilUrl ?? null,
    cidade: usuario.cidade ?? null,
    latitude: usuario.latitude ?? null,
    longitude: usuario.longitude ?? null,
    bio: usuario.bio ?? null,
    createdAt: usuario.createdAt,
  })),
  login: vi.fn(),
  dbUsuarioFirst: vi.fn(),
}));

vi.mock('../src/services/esportes.service.js', () => ({
  createEsporte: mocks.createEsporte,
  getAllEsportes: mocks.getAllEsportes,
  getEsporteById: mocks.getEsporteById,
  updateEsporte: mocks.updateEsporte,
  deleteEsporte: mocks.deleteEsporte,
  toPublicEsporte: mocks.toPublicEsporte,
}));

vi.mock('../src/services/usuarios.service.js', () => ({
  createUsuario: mocks.createUsuario,
  getUsuarioById: mocks.getUsuarioById,
  updateUsuario: mocks.updateUsuario,
  deleteUsuario: mocks.deleteUsuario,
  toPublicUsuario: mocks.toPublicUsuario,
}));

vi.mock('../src/services/auth.service.js', () => ({
  AuthService: { login: mocks.login },
}));

vi.mock('../src/prisma/db.js', () => ({
  db: {
    orm: {
      public: {
        Usuarios: { first: mocks.dbUsuarioFirst },
      },
    },
  },
}));

import { app } from '../src/app.js';
import { env } from '../src/config/env.js';

const usuario = {
  id: 1n,
  nome: 'Pessoa',
  sobrenome: 'Teste',
  username: 'pessoa.teste',
  email: 'pessoa@example.com',
  fotoPerfilUrl: null,
  cidade: null,
  latitude: null,
  longitude: null,
  bio: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

const esporte = { id: 1, nome: 'Futebol' };

const dadosUsuario = {
  nome: 'Pessoa',
  sobrenome: 'Teste',
  username: 'pessoa.teste',
  email: 'pessoa@example.com',
  senha: 'Senha123',
};

const tokenValido = () =>
  jwt.sign({ id: '1' }, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '15m',
    issuer: 'sportmap-api',
    audience: 'sportmap',
  });

const autenticado = () =>
  request(app).get('/usuarios').set('Authorization', `Bearer ${tokenValido()}`);

beforeEach(() => {
  vi.clearAllMocks();

  mocks.dbUsuarioFirst.mockResolvedValue(usuario);

  mocks.createEsporte.mockImplementation(async (dados: { nome: string }) => ({
    id: 1,
    ...dados,
  }));
  mocks.getAllEsportes.mockResolvedValue([esporte]);
  mocks.getEsporteById.mockResolvedValue(esporte);
  mocks.updateEsporte.mockImplementation(async (_id: number, dados: { nome?: string }) => ({
    ...esporte,
    ...dados,
  }));
  mocks.deleteEsporte.mockResolvedValue(undefined);

  mocks.createUsuario.mockResolvedValue(usuario);
  mocks.getUsuarioById.mockResolvedValue(usuario);
  mocks.updateUsuario.mockResolvedValue(usuario);
  mocks.deleteUsuario.mockResolvedValue(undefined);

  mocks.login.mockResolvedValue({
    token: tokenValido(),
    usuario: {
      id: '1',
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      username: usuario.username,
      email: usuario.email,
    },
  });
});

describe('Testes automatizados da API SportMap', () => {
  describe('Disponibilidade e erros gerais', () => {
    it('GET /health deve retornar 200 e status ok', async () => {
      const resposta = await request(app).get('/health');

      expect(resposta.status).toBe(200);
      expect(resposta.body).toEqual({ status: 'ok' });
      expect(resposta.headers['x-content-type-options']).toBe('nosniff');
    });

    it('rota inexistente deve retornar 404', async () => {
      const resposta = await request(app).get('/rota-que-nao-existe');

      expect(resposta.status).toBe(404);
      expect(resposta.body).toEqual({ error: 'Rota não encontrada.' });
    });

    it('JSON malformado deve retornar 400', async () => {
      const resposta = await request(app)
        .post('/usuarios')
        .set('Content-Type', 'application/json')
        .send('{');

      expect(resposta.status).toBe(400);
    });
  });

  describe('CRUD de esportes', () => {
    it('POST /esportes deve cadastrar um esporte', async () => {
      const resposta = await request(app).post('/esportes').send({ nome: '  Futebol  ' });

      expect(resposta.status).toBe(201);
      expect(resposta.body).toEqual({ id: 1, nome: 'Futebol' });
      expect(mocks.createEsporte).toHaveBeenCalledWith({ nome: 'Futebol' });
    });

    it('POST /esportes deve rejeitar nome ausente', async () => {
      const resposta = await request(app).post('/esportes').send({});

      expect(resposta.status).toBe(400);
      expect(mocks.createEsporte).not.toHaveBeenCalled();
    });

    it('POST /esportes deve rejeitar nome acima de 50 caracteres', async () => {
      const resposta = await request(app).post('/esportes').send({ nome: 'a'.repeat(51) });

      expect(resposta.status).toBe(400);
      expect(mocks.createEsporte).not.toHaveBeenCalled();
    });

    it('GET /esportes deve listar os esportes', async () => {
      const resposta = await request(app).get('/esportes');

      expect(resposta.status).toBe(200);
      expect(resposta.body).toEqual([{ nome: 'Futebol' }]);
      expect(mocks.getAllEsportes).toHaveBeenCalledOnce();
    });

    it('GET /esportes/:id deve consultar um esporte', async () => {
      const resposta = await request(app).get('/esportes/1');

      expect(resposta.status).toBe(200);
      expect(resposta.body).toEqual({ nome: 'Futebol' });
      expect(mocks.getEsporteById).toHaveBeenCalledWith(1);
    });

    it('GET /esportes/:id deve rejeitar ID inválido', async () => {
      const resposta = await request(app).get('/esportes/abc');

      expect(resposta.status).toBe(400);
      expect(mocks.getEsporteById).not.toHaveBeenCalled();
    });

    it('PUT /esportes/:id deve atualizar um esporte', async () => {
      const resposta = await request(app).put('/esportes/1').send({ nome: 'Vôlei' });

      expect(resposta.status).toBe(200);
      expect(resposta.body).toEqual({ nome: 'Vôlei' });
      expect(mocks.updateEsporte).toHaveBeenCalledWith(1, { nome: 'Vôlei' });
    });

    it('DELETE /esportes/:id deve retornar 204', async () => {
      const resposta = await request(app).delete('/esportes/1');

      expect(resposta.status).toBe(204);
      expect(mocks.deleteEsporte).toHaveBeenCalledWith(1);
    });
  });

  describe('Cadastro e proteção de usuários', () => {
    it('POST /usuarios deve cadastrar com os campos do projeto', async () => {
      const resposta = await request(app).post('/usuarios').send(dadosUsuario);

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('username', 'pessoa.teste');
      expect(resposta.body).not.toHaveProperty('senha');
      expect(resposta.body).not.toHaveProperty('senhaHash');
      expect(mocks.createUsuario).toHaveBeenCalledWith({
        ...dadosUsuario,
        fotoPerfilUrl: undefined,
        cidade: undefined,
        bio: undefined,
      });
    });

    it('POST /usuarios deve rejeitar e-mail inválido', async () => {
      const resposta = await request(app)
        .post('/usuarios')
        .send({ ...dadosUsuario, email: 'email-invalido' });

      expect(resposta.status).toBe(400);
      expect(mocks.createUsuario).not.toHaveBeenCalled();
    });

    it('POST /usuarios deve rejeitar senha curta', async () => {
      const resposta = await request(app)
        .post('/usuarios')
        .send({ ...dadosUsuario, senha: '123' });

      expect(resposta.status).toBe(400);
      expect(mocks.createUsuario).not.toHaveBeenCalled();
    });

    it('GET /usuarios deve exigir autenticação', async () => {
      const resposta = await request(app).get('/usuarios');

      expect(resposta.status).toBe(401);
      expect(mocks.getUsuarioById).not.toHaveBeenCalled();
    });

    it('GET /usuarios deve retornar somente o usuário autenticado', async () => {
      const resposta = await autenticado();

      expect(resposta.status).toBe(200);
      expect(resposta.body).toHaveLength(1);
      expect(resposta.body[0]).toHaveProperty('username', 'pessoa.teste');
      expect(resposta.body[0]).not.toHaveProperty('senhaHash');
      expect(mocks.dbUsuarioFirst).toHaveBeenCalledWith({ id: 1n });
    });

    it('GET /usuarios/:id deve impedir acesso a outra conta', async () => {
      const resposta = await request(app)
        .get('/usuarios/2')
        .set('Authorization', `Bearer ${tokenValido()}`);

      expect(resposta.status).toBe(403);
      expect(mocks.getUsuarioById).not.toHaveBeenCalled();
    });

    it('PUT /usuarios/:id deve rejeitar atualização vazia', async () => {
      const resposta = await request(app)
        .put('/usuarios/1')
        .set('Authorization', `Bearer ${tokenValido()}`)
        .send({});

      expect(resposta.status).toBe(400);
      expect(mocks.updateUsuario).not.toHaveBeenCalled();
    });

    it('DELETE /usuarios/:id deve retornar 204 para a própria conta', async () => {
      const resposta = await request(app)
        .delete('/usuarios/1')
        .set('Authorization', `Bearer ${tokenValido()}`);

      expect(resposta.status).toBe(204);
      expect(mocks.deleteUsuario).toHaveBeenCalledWith(1);
    });

    it('deve rejeitar token inválido', async () => {
      const resposta = await request(app)
        .get('/usuarios')
        .set('Authorization', 'Bearer token-invalido');

      expect(resposta.status).toBe(401);
    });
  });

  describe('Autenticação', () => {
    it('POST /login deve aceitar credenciais válidas e definir cookie HttpOnly', async () => {
      const resposta = await request(app)
        .post('/login')
        .send({ email: 'pessoa@example.com', password: 'Senha123' });

      expect(resposta.status).toBe(200);
      expect(resposta.body).toHaveProperty('token');
      expect(resposta.headers['set-cookie']?.[0]).toContain('HttpOnly');
      expect(mocks.login).toHaveBeenCalledWith({
        email: 'pessoa@example.com',
        password: 'Senha123',
      });
    });

    it('POST /login deve rejeitar e-mail inválido', async () => {
      const resposta = await request(app)
        .post('/login')
        .send({ email: 'invalido', password: 'Senha123' });

      expect(resposta.status).toBe(400);
      expect(mocks.login).not.toHaveBeenCalled();
    });

    it('POST /logout deve limpar o cookie e retornar 204', async () => {
      const resposta = await request(app).post('/logout');

      expect(resposta.status).toBe(204);
      expect(resposta.headers['set-cookie']?.[0]).toContain('token=;');
    });
  });
});
