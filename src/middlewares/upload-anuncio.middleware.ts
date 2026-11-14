
import multer from 'multer';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';

const pastaUploads = path.resolve('uploads/anuncios');

fs.mkdirSync(pastaUploads, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, pastaUploads);
  },

  filename: (_req, file, callback) => {
    const extensao = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extensao}`);
  }
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, callback) => {
  const tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (!tiposPermitidos.includes(file.mimetype)) {
    return callback(new Error('Formato de imagem não permitido.'));
  }

  callback(null, true);
};

export const uploadAnuncio = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
