// Arquivo: src/middlewares/authenticate.ts
import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../lib/http-error.js';

// TODO: PROVISÓRIO. Qualquer pessoa pode se passar por outra.
// Trocar pela versão com JWT quando o login existir. NÃO fazer deploy assim.
export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const raw = req.header('x-user-id');

  if (!raw || !/^[1-9]\d*$/.test(raw)) {
    throw new HttpError(401, 'Usuário não autenticado.');
  }

  (req as Request & { user?: { id: string } }).user = { id: raw };
  next();
};