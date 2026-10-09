import express from 'express'; import cookieParser from 'cookie-parser'; import helmet from 'helmet';

import routes from './routes/index.js'; import { env } from './config/env.js'; import { corsMiddleware } from './middlewares/cors.middleware.js'; import { morganMiddleware } from './middlewares/morgan.middleware.js'; import { originGuard } from './middlewares/origin.middleware.js'; import { limiter, loginLimiter, } from './middlewares/rateLimit.middleware.js'; import { errorHandler } from './middlewares/error.middleware.js'; import { logger } from './config/logger.js';

import { setupSwagger } from './config/swagger.js';

export const app = express();

// Registra os pedidos HTTP.
 app.use(morganMiddleware);

// Cabeçalhos de segurança.
 app.use( helmet({ contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : { directives: { 'upgrade-insecure-requests': null, }, }, }), );

// CORS e verificação de origem.
 app.use(corsMiddleware); app.use(originGuard);

// Verificação de disponibilidade antes do limite geral
 app.get('/health', (_req, res) => { res.json({ status: 'ok' }); });

// Limite geral da API.
 app.use(limiter);

// Limite específico para login.
 app.use('/login', loginLimiter);

// Leitura de cookies e JSON
 app.use(cookieParser()); app.use(express.json({ limit: '16kb' }));

// Arquivos enviados.
 app.use('/uploads', express.static('uploads'));

// Rotas existentes do SportMap.
 app.use(routes);

  // Documentação da API com Swagger.
 setupSwagger(app);

// Rota inexistente. 
app.use((_req, res) => { logger.warn('Rota não encontrada.'); res.status(404).json({ error: 'Rota não encontrada.', }); });

// Tratamento centralizado de erros. 
app.use(errorHandler);