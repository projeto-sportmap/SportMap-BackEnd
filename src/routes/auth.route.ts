
import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { loginSchema } from '../schemas/auth.schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Login e logout de usuários
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realizar login
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: Senha123!
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Dados de entrada inválidos
 *       401:
 *         description: Credenciais inválidas
 */
router.post(
  '/login',
  validate(loginSchema),
  AuthController.login,
);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Realizar logout
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Usuário não autenticado
 */
router.post(
  '/logout',
  AuthController.logout,
);

export default router;
