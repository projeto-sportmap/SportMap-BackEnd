import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

const mocks = vi.hoisted(() => ({
  createEsporte: vi.fn(),
  getAllEsportes: vi.fn(),
  getEsporteById: vi.fn(),
  updateEsporte: vi.fn(),
  deleteEsporte: vi.fn(),
  toPublicEsporte: vi.fn((esporte: any) => ({ id: esporte.id, nome: esporte.nome })),
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
  dbPublicacaoCreate: vi.fn(),
  dbPublicacaoFirst: vi.fn(),
  dbComentarioCreate: vi.fn(),
  createCurtida: vi.fn(),
  getAllCurtidas: vi.fn(),
  getCurtidaById: vi.fn(),
  deleteCurtida: vi.fn(),
  createSeguidores: vi.fn(),
  getAllSeguidores: vi.fn(),
  getSeguidor: vi.fn(),
  deleteSeguidores: vi.fn(),
  toPublicSeguidores: vi.fn((relacao: any) => ({
    seguidorId: String(relacao.seguidorId),
    seguidoId: String(relacao.seguidoId),
  })),
  toPublicCurtida: vi.fn((curtida: any) => ({
    id: String(curtida.id),
    publicacaoId: String(curtida.publicacaoId),
    usuarioId: String(curtida.usuarioId),
    createdAt: curtida.createdAt,
  })),
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

vi.mock('../src/services/curtidas.service.js', () => ({
  createCurtida: mocks.createCurtida,
  getAllCurtidas: mocks.getAllCurtidas,
  getCurtidaById: mocks.getCurtidaById,
  deleteCurtida: mocks.deleteCurtida,
  toPublicCurtida: mocks.toPublicCurtida,
}));

vi.mock('../src/services/seguidores.service.js', () => ({
  createSeguidores: mocks.createSeguidores,
  getAllSeguidores: mocks.getAllSeguidores,
  getSeguidor: mocks.getSeguidor,
  deleteSeguidores: mocks.deleteSeguidores,
  toPublicSeguidores: mocks.toPublicSeguidores,
}));

vi.mock('../src/prisma/db.js', () => ({
  db: {
    orm: {
      public: {
        Usuarios: { first: mocks.dbUsuarioFirst },
        Publicacoes: { create: mocks.dbPublicacaoCreate, first: mocks.dbPublicacaoFirst },
        Comentarios: { create: mocks.dbComentarioCreate },
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
  mocks.dbPublicacaoCreate.mockImplementation(async (dados) => ({
    id: 1n,
    ...dados,
    createdAt: usuario.createdAt,
  }));

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
  mocks.createCurtida.mockImplementation(async (dados) => ({
    id: 10n,
    publicacaoId: BigInt(dados.publicacaoId),
    usuarioId: BigInt(dados.usuarioId),
    createdAt: usuario.createdAt,
  }));
  mocks.getAllCurtidas.mockResolvedValue([]);
  mocks.getCurtidaById.mockResolvedValue({
    id: 10n,
    publicacaoId: 1n,
    usuarioId: 1n,
    createdAt: usuario.createdAt,
  });
  mocks.deleteCurtida.mockResolvedValue(undefined);
  mocks.createSeguidores.mockImplementation(async (relacao) => relacao);
  mocks.getAllSeguidores.mockResolvedValue([]);
  mocks.getSeguidor.mockResolvedValue({ seguidorId: 1n, seguidoId: 2n });
  mocks.deleteSeguidores.mockResolvedValue(undefined);

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
      const resposta = await request(app).post('/esportes').send({ nome: 'Futebol' });

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
      expect(resposta.body).toEqual([{ id: 1, nome: 'Futebol' }]);
      expect(mocks.getAllEsportes).toHaveBeenCalledOnce();
    });

    it('GET /esportes/:id deve consultar um esporte', async () => {
      const resposta = await request(app).get('/esportes/1');

      expect(resposta.status).toBe(200);
      expect(resposta.body).toEqual({ id: 1, nome: 'Futebol' });
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
      expect(resposta.body).toEqual({ id: 1, nome: 'Vôlei' });
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
        .send({ email: 'pessoa@example.com', senha: 'Senha123' });

      expect(resposta.status).toBe(200);
      expect(resposta.body).toHaveProperty('token');
      expect(resposta.headers['set-cookie']?.[0]).toContain('HttpOnly');
      expect(mocks.login).toHaveBeenCalledWith({
        email: 'pessoa@example.com',
        senha: 'Senha123',
      });
    });

    it('POST /login deve rejeitar e-mail inválido', async () => {
      const resposta = await request(app)
        .post('/login')
        .send({ email: 'invalido', senha: 'Senha123' });

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

describe('Publicação autenticada', () => {
  it('publica após login usando cookie e sem usuarioId', async () => {
    const cliente = request.agent(app);
    await cliente.post('/login').send({ email: 'pessoa@example.com', senha: 'Senha123' }).expect(200);
    const resposta = await cliente.post('/publicacoes').set('Origin', env.FRONTEND_ORIGIN).send({ conteudo: '  Meu treino  ' });
    expect(resposta.status).toBe(201);
    expect(resposta.body).toMatchObject({ id: '1', usuarioId: '1', conteudo: 'Meu treino' });
    expect(mocks.dbPublicacaoCreate).toHaveBeenCalledWith(expect.objectContaining({ usuarioId: 1n, conteudo: 'Meu treino' }));
  });

  it('exige autenticação', async () => {
    await request(app).post('/publicacoes').send({ usuarioId: 1, conteudo: 'Treino' }).expect(401);
    expect(mocks.dbPublicacaoCreate).not.toHaveBeenCalled();
  });

  it('usa o autor autenticado mesmo com usuarioId diferente no corpo', async () => {
    const resposta = await request(app).post('/publicacoes').set('Authorization', 'Bearer ' + tokenValido()).send({ usuarioId: '2', conteudo: 'Treino' }).expect(201);
    expect(resposta.body.usuarioId).toBe('1');
    expect(mocks.dbPublicacaoCreate).toHaveBeenCalledWith(expect.objectContaining({ usuarioId: 1n }));
  });

  it('aceita usuarioId correspondente com Bearer', async () => {
    await request(app).post('/publicacoes').set('Authorization', 'Bearer ' + tokenValido()).send({ usuarioId: 1, conteudo: 'Treino' }).expect(201);
  });

  it('mantém a validação das coordenadas', async () => {
    await request(app).post('/publicacoes').set('Authorization', 'Bearer ' + tokenValido()).send({ conteudo: 'Treino', latitude: 10 }).expect(400);
    expect(mocks.dbPublicacaoCreate).not.toHaveBeenCalled();
  });
});

describe('Curtidas autenticadas', () => {
  it('cria, lista e remove curtida usando o usuário do JWT', async () => {
    const token = tokenValido();
    const headers = { Authorization: `Bearer ${token}` };

    const criada = await request(app)
      .post('/curtidas')
      .set(headers)
      .send({ publicacaoId: 27, usuarioId: 1 });
    expect(criada.status).toBe(201);
    expect(criada.body).toMatchObject({
      id: '10',
      publicacaoId: '27',
      usuarioId: '1',
    });

    mocks.getAllCurtidas.mockResolvedValue([{
      id: 10n,
      publicacaoId: 27n,
      usuarioId: 1n,
      createdAt: usuario.createdAt,
    }]);
    const lista = await request(app)
      .get('/curtidas?publicacaoId=27&usuarioId=1')
      .set(headers)
      .expect(200);
    expect(lista.body).toMatchObject([{ id: '10', publicacaoId: '27', usuarioId: '1' }]);

    await request(app)
      .delete('/curtidas/10')
      .set(headers)
      .expect(204);
    expect(mocks.deleteCurtida).toHaveBeenCalledWith(10, 1n);
  });

  it('rejeita curtida com usuário diferente do JWT', async () => {
    await request(app)
      .post('/curtidas')
      .set('Authorization', `Bearer ${tokenValido()}`)
      .send({ publicacaoId: 27, usuarioId: 2 })
      .expect(403);
    expect(mocks.createCurtida).not.toHaveBeenCalled();
  });

  it('exige autenticação para operações de curtida', async () => {
    await request(app).get('/curtidas').expect(401);
    await request(app).post('/curtidas').send({ publicacaoId: 27, usuarioId: 1 }).expect(401);
    await request(app).delete('/curtidas/10').expect(401);
  });
});

describe('Relacionamentos de seguimento', () => {
  const headers = () => ({ Authorization: `Bearer ${tokenValido()}` });

  it('cria o relacionamento usando a conta autenticada', async () => {
    const resposta = await request(app)
      .post('/seguidores')
      .set(headers())
      .send({ seguidoId: '2' })
      .expect(201);

    expect(resposta.body).toEqual({ seguidorId: '1', seguidoId: '2' });
    expect(mocks.createSeguidores).toHaveBeenCalledWith({ seguidorId: 1n, seguidoId: 2n });
  });

  it('lista os relacionamentos filtrados pela conta seguidora', async () => {
    mocks.getAllSeguidores.mockResolvedValue([{ seguidorId: 1n, seguidoId: 2n }]);

    await request(app)
      .get('/seguidores?seguidorId=1&limit=100&offset=0')
      .expect(200);

    expect(mocks.getAllSeguidores).toHaveBeenCalledWith(100, 0, {
      seguidorId: 1n,
      seguidoId: undefined,
    });
  });

  it('remove o relacionamento da conta autenticada', async () => {
    await request(app)
      .delete('/seguidores/1/2')
      .set(headers())
      .expect(204);

    expect(mocks.deleteSeguidores).toHaveBeenCalledWith(1n, 2n);
  });

  it('bloqueia remoção em nome de outra conta e exige login para seguir', async () => {
    await request(app)
      .delete('/seguidores/2/3')
      .set(headers())
      .expect(403);
    await request(app).post('/seguidores').send({ seguidoId: '2' }).expect(401);

    expect(mocks.deleteSeguidores).not.toHaveBeenCalled();
    expect(mocks.createSeguidores).not.toHaveBeenCalled();
  });
});

describe('CORS de desenvolvimento', () => {
  for (const origin of [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ]) {
    it(`aceita preflight de ${origin}`, async () => {
      const resposta = await request(app)
        .options('/curtidas')
        .set('Origin', origin)
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'authorization,content-type')
        .expect(204);
      expect(resposta.headers['access-control-allow-origin']).toBe(origin);
      expect(resposta.headers['access-control-allow-credentials']).toBe('true');
    });
  }
});

describe('Comentários em publicações', () => {
  it('permite que outro usuário logado comente após a publicação', async () => {
    const autor = request.agent(app);
    await autor.post('/login').send({ email: usuario.email, senha: 'Senha123' }).expect(200);
    const publicacao = await autor.post('/publicacoes')
      .set('Origin', env.API_ORIGIN)
      .send({ conteudo: 'Meu treino' }).expect(201);

    const outroUsuario = { ...usuario, id: 2n, email: 'outro@example.com' };
    const token = jwt.sign({ id: '2' }, env.JWT_SECRET, {
      algorithm: 'HS256', expiresIn: '15m', issuer: 'sportmap-api', audience: 'sportmap',
    });
    mocks.login.mockResolvedValue({ token, usuario: { id: '2' } });
    mocks.dbUsuarioFirst.mockResolvedValue(outroUsuario);
    mocks.dbPublicacaoFirst.mockResolvedValue({ ...publicacao.body, id: 1n, usuarioId: 1n });
    mocks.dbComentarioCreate.mockImplementation(async (dados) => ({
      id: 10n, ...dados, createdAt: usuario.createdAt,
    }));
    const leitor = request.agent(app);
    await leitor.post('/login').send({ email: outroUsuario.email, senha: 'Senha123' }).expect(200);
    const comentario = await leitor.post(`/publicacoes/${publicacao.body.id}/comentarios`)
      .set('Origin', env.API_ORIGIN)
      .send({ conteudo: '  Bom treino!  ' }).expect(201);

    expect(comentario.body).toMatchObject({ publicacaoId: '1', usuarioId: '2', conteudo: 'Bom treino!' });
    expect(mocks.dbComentarioCreate).toHaveBeenCalledWith({
      publicacaoId: 1n, usuarioId: 2n, conteudo: 'Bom treino!',
    });
  });

  it('exige login para comentar', async () => {
    await request(app).post('/publicacoes/1/comentarios').send({ conteudo: 'Bom treino!' }).expect(401);
    expect(mocks.dbComentarioCreate).not.toHaveBeenCalled();
  });

  it('rejeita comentários em publicação inexistente', async () => {
    mocks.dbPublicacaoFirst.mockResolvedValue(null);
    await request(app).post('/publicacoes/999/comentarios')
      .set('Authorization', 'Bearer ' + tokenValido())
      .send({ conteudo: 'Bom treino!' }).expect(404);
    expect(mocks.dbComentarioCreate).not.toHaveBeenCalled();
  });
});
