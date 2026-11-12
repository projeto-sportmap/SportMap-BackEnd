import { Router } from 'express';
import * as SeguidoresController from '../controllers/seguidores.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middlewares.js';
import {
  createSeguidorSchema,
  listSeguidoresSchema,
  seguidoresParamsSchema,
} from '../schemas/seguidores.schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Seguidores
 *   description: Gerenciamento dos relacionamentos entre seguidores e usuários seguidos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateSeguidor:
 *       type: object
 *       required:
 *         - seguidoId
 *       properties:
 *         seguidoId:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           description: ID do usuário seguido (também aceita número em formato de texto).
 *           example: 2
 */

/**
 * @swagger
 * /seguidores:
 *   post:
 *     summary: Criar um relacionamento de seguimento
 *     tags: [Seguidores]
 *     description: O seguidor é sempre o usuário autenticado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSeguidor'
 *     responses:
 *       201:
 *         description: Relacionamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/seguidores',
  authMiddleware,
  validate(createSeguidorSchema),
  SeguidoresController.createSeguidores,
);

/**
 * @swagger
 * /seguidores:
 *   get:
 *     summary: Listar todos os relacionamentos de seguimento
 *     tags: [Seguidores]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 20
 *         description: Quantidade máxima de registros retornados
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Quantidade de registros a pular (paginação)
 *     responses:
 *       200:
 *         description: Lista de relacionamentos retornada com sucesso
 *       400:
 *         description: Parâmetros de consulta inválidos
 */
router.get('/seguidores', validate(listSeguidoresSchema), SeguidoresController.getAllSeguidores);

/**
 * @swagger
 * /seguidores/{seguidorId}/{seguidoId}:
 *   get:
 *     summary: Consultar relacionamento entre dois usuários
 *     tags: [Seguidores]
 *     parameters:
 *       - in: path
 *         name: seguidorId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID do usuário que segue
 *       - in: path
 *         name: seguidoId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID do usuário seguido
 *     responses:
 *       200:
 *         description: Relacionamento encontrado
 *       400:
 *         description: IDs inválidos
 *       404:
 *         description: Relacionamento não encontrado
 */
router.get(
  '/seguidores/:seguidorId/:seguidoId',
  validate(seguidoresParamsSchema),
  SeguidoresController.getSeguidor,
);

/**
 * @swagger
 * /seguidores/{seguidorId}/{seguidoId}:
 *   delete:
 *     summary: Remover relacionamento de seguimento
 *     tags: [Seguidores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seguidorId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID do usuário que segue
 *       - in: path
 *         name: seguidoId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID do usuário seguido
 *     responses:
 *       204:
 *         description: Relacionamento removido com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: IDs inválidos
 *       404:
 *         description: Relacionamento não encontrado
 */
router.delete(
  '/seguidores/:seguidorId/:seguidoId',
  authMiddleware,
  validate(seguidoresParamsSchema),
  SeguidoresController.deleteSeguidores,
);

export default router;
