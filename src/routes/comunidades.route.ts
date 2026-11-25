import { Router } from 'express';
import * as ComunidadesController from '../controllers/comunidades.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createComunidadeSchema,
  updateComunidadeSchema,
  comunidadeIdSchema,
} from '../schemas/comunidades.schema.js';

const router = Router();

// Todas as rotas de comunidades exigem autenticação
router.use('/comunidades', authMiddleware);

router.post('/comunidades', validate(createComunidadeSchema), ComunidadesController.createComunidade);
router.get('/comunidades', ComunidadesController.getAllComunidades);
router.get('/comunidades/:id', validate(comunidadeIdSchema), ComunidadesController.getComunidadeById);
router.put('/comunidades/:id', validate(updateComunidadeSchema), ComunidadesController.updateComunidade);
router.delete('/comunidades/:id', validate(comunidadeIdSchema), ComunidadesController.deleteComunidade);

router.post('/comunidades/:id/participar', validate(comunidadeIdSchema), ComunidadesController.participarComunidade);
router.delete('/comunidades/:id/participar', validate(comunidadeIdSchema), ComunidadesController.sairComunidade);

export default router;