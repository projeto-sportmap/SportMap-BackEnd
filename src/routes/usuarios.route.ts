import { Router } from 'express';
import * as UsuariosController from '../controllers/usuarios.controller.js';
import { validate } from '../middlewares/validate.js';
import { uploadFoto } from '../middlewares/upload.js';
import {
  createUsuarioSchema,
  updateUsuarioSchema,
  usuarioIdSchema,
  localizacaoSchema,
} from '../schemas/usuarios.schema.js';

const router = Router();
router.post('/usuarios', validate(createUsuarioSchema), UsuariosController.createUsuario);
router.get('/usuarios', UsuariosController.getAllUsuarios);
router.get('/usuarios/:id', validate(usuarioIdSchema), UsuariosController.getUsuarioById);
router.put('/usuarios/:id', validate(updateUsuarioSchema), UsuariosController.updateUsuario);
router.patch('/usuarios/:id/localizacao', validate(localizacaoSchema), UsuariosController.updateLocalizacao);
router.patch('/usuarios/:id/foto', validate(usuarioIdSchema), uploadFoto, UsuariosController.updateFoto);
router.delete('/usuarios/:id', validate(usuarioIdSchema), UsuariosController.deleteUsuario);
export default router;