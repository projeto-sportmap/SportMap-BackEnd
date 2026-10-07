import express from 'express';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

export const app = express();
app.use(express.json({ limit: '16kb' }));
app.use('/uploads', express.static('uploads'));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use(routes);
app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));
app.use(errorHandler);