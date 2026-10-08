import express from 'express';
import cookieParser from 'cookie-parser';

import routes from './routes/index.js';

import { corsMiddleware } from './middlewares/cors.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

export const app = express();

/*
 * CORS
 *
 * Precisa vir antes das rotas.
 */
app.use(corsMiddleware);

/*
 * Cookies
 *
 * Necessário para ler:
 *
 * req.cookies.token
 */
app.use(cookieParser());

/*
 * JSON
 */
app.use(
  express.json({
    limit: '16kb',
  }),
);

/*
 * Arquivos enviados
 */
app.use(
  '/uploads',
  express.static('uploads'),
);

/*
 * Health check
 */
app.get(
  '/health',
  (_req, res) =>
    res.json({
      status: 'ok',
    }),
);

/*
 * Rotas da API
 */
app.use(routes);

/*
 * 404
 */
app.use(
  (_req, res) =>
    res
      .status(404)
      .json({
        error: 'Rota não encontrada.',
      }),
);

/*
 * Tratamento de erros
 */
app.use(errorHandler);