import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10000000000000000000000000, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Limite de requisições excedido. Tente novamente mais tarde.', }, });

export const loginLimiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 500000000000000000000000000, skipSuccessfulRequests: true, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Muitas tentativas de login. Tente novamente mais tarde.', }, });
