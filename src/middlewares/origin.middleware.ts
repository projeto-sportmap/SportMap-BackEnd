import type { RequestHandler } from 'express';
import { isAllowedOrigin } from '../config/env.js';

export const originGuard: RequestHandler = (req, res, next) => { const origin = req.get('origin'); const unsafe = !['GET', 'HEAD', 'OPTIONS'].includes(req.method);

if ( unsafe && origin !== undefined && !isAllowedOrigin(origin) ) { res.status(403).json({ error: 'Origem não permitida.', }); return; }

next(); };
