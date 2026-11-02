import cors from 'cors';
import { allowedOrigins } from '../config/env.js';

export const corsMiddleware = cors({
  origin: allowedOrigins,

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],
});