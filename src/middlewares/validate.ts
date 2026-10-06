import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { HttpError } from '../lib/http-error.js';

export const validate = (schema: ZodType) => async (req: Request, _res: Response, next: NextFunction) => {
  const result = await schema.safeParseAsync({
    body: req.body ?? {},
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const mensagem = result.error.issues.map((i) => i.message).join(' ');
    return next(new HttpError(400, mensagem));
  }

  const data = result.data as { body?: unknown };
  if (data.body !== undefined) req.body = data.body;
  next();
};