import { Router } from 'express';
import * as UsuarioEsportesController from '../controllers/usuario-esportes.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createUsuarioEsporteSchema,
  updateUsuarioEsporteSchema,
  usuarioEsporteIdSchema,
  listUsuarioEsportesSchema,
} from '../schemas/usuario-esportes.schema.js';

const router = Router();
router.post('/usuario-esportes', validate(createUsuarioEsporteSchema), UsuarioEsportesController.createUsuarioEsporte);
router.get('/usuario-esportes', validate(listUsuarioEsportesSchema), UsuarioEsportesController.getAllUsuarioEsportes);
router.get('/usuario-esportes/:id', validate(usuarioEsporteIdSchema), UsuarioEsportesController.getUsuarioEsporteById);
router.put('/usuario-esportes/:id', validate(updateUsuarioEsporteSchema), UsuarioEsportesController.updateUsuarioEsporte);
router.delete('/usuario-esportes/:id', validate(usuarioEsporteIdSchema), UsuarioEsportesController.deleteUsuarioEsporte);
export default router;