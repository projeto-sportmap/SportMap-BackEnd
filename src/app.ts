import express from 'express';
import cookieParser from 'cookie-parser';

import routes from './routes/index.js';
import { corsMiddleware } from './middlewares/cors.middleware.js';
import { morganMiddleware } from './middlewares/morgan.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { logger } from './config/logger.js';

export const app = express();

// Registra os pedidos HTTP.
app.use(morganMiddleware);

// CORS e cookies.
app.use(corsMiddleware);
app.use(cookieParser());

// Limite do corpo JSON.
app.use(express.json({ limit: '16kb' }));

// Preserva o acesso às fotos e mídias enviadas.
app.use('/uploads', express.static('uploads'));

// Verificação de saúde da API.
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Todas as rotas existentes do SportMap.
app.use(routes);

// Rota inexistente.
app.use((_req, res) => {
  logger.warn('Rota não encontrada.');
  res.status(404).json({
    error: 'Rota não encontrada.',
  });
});

// Tratamento centralizado de erros: sempre por último.
app.use(errorHandler);