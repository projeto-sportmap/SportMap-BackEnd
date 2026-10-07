import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { HttpError } from '../lib/http-error.js';

const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

export const uploadFoto = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${crypto.randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (!tiposPermitidos.includes(file.mimetype)) {
      return cb(new HttpError(400, 'A foto deve ser JPG, PNG ou WEBP.'));
    }
    cb(null, true);
  },
}).single('foto');