import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { HttpError } from '../lib/http-error.js';

export const validate =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      params: req.params,
      query: req.query,
      body: req.body,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));

      return next(
        new HttpError(400, 'Erro de validação', errors),
      );
    }

    // Guarda o body validado
    if (
      result.data &&
      typeof result.data === 'object' &&
      'body' in result.data
    ) {
      req.body = result.data.body;
    }

    return next();
  };
