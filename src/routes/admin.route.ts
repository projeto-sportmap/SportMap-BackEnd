// Arquivo: src/routes/admin.route.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { usuarioIdSchema } from '../schemas/usuarios.schema.js';
import { getUsuarioById } from '../controllers/usuarios.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Administração
 *   description: Operações restritas a contas com permissão administrativa
 */

/**
 * @swagger
 * /admin/usuarios/{id}:
 *   get:
 *     summary: Consultar uma conta com permissão administrativa
 *     tags: [Administração]
 *     description: Exige o tipo ADMIN (permissão usuarios:read:any). Retorna a conta sem senha.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 2147483647
 *         description: ID do usuário consultado
 *     responses:
 *       200:
 *         description: Conta encontrada (sem senhaHash)
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token ausente, inválido ou conta inexistente
 *       403:
 *         description: Tipo de usuário sem a permissão usuarios:read:any
 *       404:
 *         description: Conta consultada não encontrada
 *       429:
 *         description: Limite de requisições
 */
// Ordem: autenticar → conferir permissão → validar ID → consultar.
router.get(
  '/admin/usuarios/:id',
  authMiddleware,
  requirePermission('usuarios:read:any'),
  validate(usuarioIdSchema),
  getUsuarioById,
);

export default router;