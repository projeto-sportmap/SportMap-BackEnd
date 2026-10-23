// Arquivo: src/middlewares/permission.middleware.ts
import type { RequestHandler } from 'express';
import { db } from '../prisma/db.js';
import { hasPermission, type Permission } from '../security/permissions.js';

/**
 * Deve rodar DEPOIS do authMiddleware.
 * O authMiddleware já busca o usuário no banco a cada pedido e guarda em
 * res.locals.usuario; aqui só buscamos o tipo atual e conferimos a permissão.
 * O JWT continua carregando apenas o id: o papel vem sempre do banco.
 */
export const requirePermission =
  (permission: Permission): RequestHandler =>
  async (_req, res, next) => {
    const usuario = res.locals.usuario as
      | { tipoUsuarioId: number | null }
      | undefined;

    if (!usuario) {
      res.status(401).json({ error: 'Autenticação obrigatória.' });
      return;
    }

    // Negação por padrão: sem tipo definido, sem permissão.
    if (usuario.tipoUsuarioId === null || usuario.tipoUsuarioId === undefined) {
      res.status(403).json({ error: 'Você não tem permissão para esta operação.' });
      return;
    }

    const tipo = await db.orm.public.TipoUsuario.first({ id: usuario.tipoUsuarioId });

    if (!tipo || !hasPermission(tipo.code, permission)) {
      res.status(403).json({ error: 'Você não tem permissão para esta operação.' });
      return;
    }

    next();
  };