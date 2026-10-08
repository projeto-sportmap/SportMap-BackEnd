
import { Router } from 'express';
import * as UsuariosController from '../controllers/usuarios.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { uploadFoto } from '../middlewares/upload.js';

import {
  createUsuarioSchema,
  updateUsuarioSchema,
  usuarioIdSchema,
  localizacaoSchema,
} from '../schemas/usuarios.schema.js';

import {
  authMiddleware,
  requireSelf,
} from '../middlewares/auth.middleware.js';

const router = Router();

/*
 * CADASTRO
 *
 * Continua público.
 */
router.post(
  '/usuarios',
  validate(createUsuarioSchema),
  UsuariosController.createUsuario,
);

/*
 * LISTAGEM
 *
 * Agora exige login.
 * Retorna somente o próprio usuário.
 */
router.get(
  '/usuarios',
  authMiddleware,
  UsuariosController.getAllUsuarios,
);

/*
 * CONSULTAR USUÁRIO
 *
 * Só pode consultar a própria conta.
 */
router.get(
  '/usuarios/:id',
  authMiddleware,
  validate(usuarioIdSchema),
  requireSelf,
  UsuariosController.getUsuarioById,
);

/*
 * ALTERAR USUÁRIO
 *
 * Só pode alterar a própria conta.
 */
router.put(
  '/usuarios/:id',
  authMiddleware,
  validate(updateUsuarioSchema),
  requireSelf,
  UsuariosController.updateUsuario,
);

/*
 * Atualizar localização
 *
 * Só pode alterar a própria localização.
 */
router.patch(
  '/usuarios/:id/localizacao',
  authMiddleware,
  validate(localizacaoSchema),
  requireSelf,
  UsuariosController.updateLocalizacao,
);

/*
 * Atualizar foto
 *
 * Só pode alterar a própria foto.
 */
router.patch(
  '/usuarios/:id/foto',
  authMiddleware,
  validate(usuarioIdSchema),
  requireSelf,
  uploadFoto,
  UsuariosController.updateFoto,
);

/*
 * Excluir conta
 *
 * Só pode excluir a própria conta.
 */
router.delete(
  '/usuarios/:id',
  authMiddleware,
  validate(usuarioIdSchema),
  requireSelf,
  UsuariosController.deleteUsuario,
);

export default router;