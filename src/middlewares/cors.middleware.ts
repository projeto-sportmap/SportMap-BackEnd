import cors from 'cors';
import { isAllowedOrigin } from '../config/env.js';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    callback(null, !origin || isAllowedOrigin(origin));
  },

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
