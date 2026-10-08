import type { ErrorRequestHandler } from 'express'; import { HttpError } from '../lib/http-error.js'; import { logger } from '../config/logger.js';

export const errorHandler: ErrorRequestHandler = ( error: unknown, _req, res, next, ) => { if (res.headersSent) { next(error); return; }

if (error instanceof HttpError) { res.status(error.status).json({ error: error.message, }); return; }

const err = error as { status?: number; sqlState?: string; } | null;

if (err?.sqlState === '23505') { res.status(409).json({ error: 'Um registro com esses dados já existe.', }); return; }

if (err?.status === 400) { res.status(400).json({ error: 'JSON inválido.', }); return; }

if (err?.status === 413) { res.status(413).json({ error: 'Corpo da requisição muito grande.', }); return; }

logger.error('Erro interno na API.', { errorType: error instanceof Error ? error.name : 'unknown', });

res.status(500).json({ error: 'Erro interno do servidor.', }); };