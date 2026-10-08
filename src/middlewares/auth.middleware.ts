
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { db } from '../prisma/db.js';

type JwtPayload = {
  id?: unknown;
  iat?: unknown;
  exp?: unknown;
  iss?: unknown;
  aud?: unknown;
};

export const authMiddleware: RequestHandler = async (
  req,
  res,
  next,
) => {
  const authorization = req.get('authorization');

  let token: string | undefined;

  // 1. Authorization: Bearer TOKEN
  if (authorization !== undefined) {
    const match = /^Bearer ([^\s]+)$/i.exec(authorization);

    if (!match) {
      res.status(401).json({
        error: 'Cabeçalho Authorization inválido.',
      });
      return;
    }

    token = match[1];
  }

  // 2. Cookie
  else if (typeof req.cookies?.token === 'string') {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).json({
      error: 'Token não fornecido.',
    });
    return;
  }

  // Quando a autenticação utiliza cookie,
  // requisições que alteram dados precisam
  // vir de uma origem confiável.
  const unsafe = !['GET', 'HEAD', 'OPTIONS'].includes(
    req.method,
  );

  if (
    authorization === undefined &&
    unsafe &&
    ![
      env.FRONTEND_ORIGIN,
      env.API_ORIGIN,
    ].includes(req.get('origin') ?? '')
  ) {
    res.status(403).json({
      error:
        'Origem obrigatória e confiável para autenticação por cookie.',
    });
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      env.JWT_SECRET,
      {
        algorithms: ['HS256'],
        issuer: 'sportmap-api',
        audience: 'sportmap',
      },
    ) as JwtPayload;

    if (
      typeof payload === 'string' ||
      typeof payload.id !== 'string' ||
      !/^\d+$/.test(payload.id)
    ) {
      throw new Error('Payload inválido.');
    }

    const userId = BigInt(payload.id);

    const usuario = await db.orm.public.Usuarios.first({
      id: userId,
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    res.locals.userId = userId;
    res.locals.usuario = usuario;

    next();
  } catch {
    res.status(401).json({
      error:
        'Token inválido, expirado ou usuário inexistente.',
    });
  }
};

export const requireSelf: RequestHandler = (
  req,
  res,
  next,
) => {
  const requestedId = String(req.params.id);

  if (!/^\d+$/.test(requestedId)) {
    res.status(400).json({
      error: 'ID deve ser numérico.',
    });
    return;
  }

  try {
    const authenticatedId = BigInt(res.locals.userId);
    const requestedUserId = BigInt(requestedId);

    if (requestedUserId !== authenticatedId) {
      res.status(403).json({
        error: 'Você só pode acessar a própria conta.',
      });
      return;
    }

    next();
  } catch {
    res.status(400).json({
      error: 'ID inválido.',
    });
  }
};