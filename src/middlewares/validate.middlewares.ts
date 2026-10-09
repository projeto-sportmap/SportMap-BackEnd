
import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { HttpError } from '../lib/http-error.js';

export const validate =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      params: req.params,
      query: req.query, // Adicionado para validar os filtros do GET
      body: req.body,
    });

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(' ');

      throw new HttpError(400, message);
    }

    // Guarda o body validado
    if (
      result.data &&
      typeof result.data === 'object' &&
      'body' in result.data
    ) {
      req.body = result.data.body;
    }

    next();
  };
