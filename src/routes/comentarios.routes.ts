// Arquivo: src/routes/comentarios.routes.ts
import { Router } from 'express';
import * as ComentariosController from '../controllers/comentarios.controllers.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { authenticate } from '../middlewares/authenticate.middlewares.js';
import {
  createComentarioSchema,
  updateComentarioSchema,
} from '../schemas/comentarios.schema.js';

const router = Router();

// Comentários de uma publicação
router.get(
  '/publicacoes/:publicacaoId/comentarios',
  ComentariosController.getComentariosByPublicacao,
);

router.post(
  '/publicacoes/:publicacaoId/comentarios',
  authenticate,
  validate(createComentarioSchema),
  ComentariosController.createComentario,
);

// Operações em um comentário específico
router.get('/comentarios/:id', ComentariosController.getComentarioById);

router.patch(
  '/comentarios/:id',
  authenticate,
  validate(updateComentarioSchema),
  ComentariosController.updateComentario,
);

router.delete(
  '/comentarios/:id',
  authenticate,
  ComentariosController.deleteComentario,
);

export default router;