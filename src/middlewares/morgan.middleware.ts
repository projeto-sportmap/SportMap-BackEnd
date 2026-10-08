import morgan from 'morgan'; import type { Request } from 'express'; import { logger } from '../config/logger.js';

morgan.token('safe-path', (req) => { const expressReq = req as Request; return (expressReq.originalUrl ?? req.url ?? '/').split('?')[0]; });

export const morganMiddleware = morgan( ':method :safe-path :status :response-time ms', { stream: { write: (message) => { logger.http(message.trim()); }, }, }, );