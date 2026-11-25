
import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import * as RecuperacaoSenhaController from '../controllers/recuperacao_senha.controller.js';

import { validate } from '../middlewares/validate.middlewares.js';
import { loginSchema } from '../schemas/auth.schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Login, logout e recuperação de senha
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realizar login
 *     tags: [Autenticação]
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
 *       204:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Usuário não autenticado
 */
router.post(
  '/logout',
  AuthController.logout,
);

/**
 * @swagger
 * /esqueci-senha:
 *   post:
 *     summary: Solicitar código de recuperação de senha
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Solicitação processada
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/esqueci-senha',
  RecuperacaoSenhaController.esqueciSenha,
);

/**
 * @swagger
 * /reenviar-codigo:
 *   post:
 *     summary: Reenviar código de recuperação de senha
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Solicitação processada
 *       400:
 *         description: Dados inválidos
 *       429:
 *         description: Aguarde antes de solicitar outro código
 */
router.post(
  '/reenviar-codigo',
  RecuperacaoSenhaController.reenviarCodigo,
);

/**
 * @swagger
 * /redefinir-senha:
 *   post:
 *     summary: Redefinir senha usando o código de recuperação
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Código inválido ou dados incorretos
 */
router.post(
  '/redefinir-senha',
  RecuperacaoSenhaController.redefinirSenha,
);

export default router;
