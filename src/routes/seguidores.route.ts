
import { Router } from 'express';
import * as SeguidoresController from '../controllers/seguidores.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Seguidores
 *   description: Gerenciamento dos relacionamentos entre seguidores e usuários seguidos
 */

/**
 * @swagger
 * /seguidores:
 *   post:
 *     summary: Criar um relacionamento de seguimento
 *     tags: [Seguidores]
 *     responses:
 *       201:
 *         description: Relacionamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/seguidores', SeguidoresController.createSeguidores);

/**
 * @swagger
 * /seguidores:
 *   get:
 *     summary: Listar todos os relacionamentos de seguimento
 *     tags: [Seguidores]
 *     responses:
 *       200:
 *         description: Lista de relacionamentos retornada com sucesso
 */
router.get('/seguidores', SeguidoresController.getAllSeguidores);

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
 *         description: ID do usuário que segue
 *       - in: path
 *         name: seguidoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário seguido
 *     responses:
 *       200:
 *         description: Relacionamento encontrado
 *       404:
 *         description: Relacionamento não encontrado
 */
router.get('/seguidores/:seguidorId/:seguidoId', SeguidoresController.getSeguidor);

/**
 * @swagger
 * /seguidores/{seguidorId}/{seguidoId}:
 *   delete:
 *     summary: Remover relacionamento de seguimento
 *     tags: [Seguidores]
 *     parameters:
 *       - in: path
 *         name: seguidorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário que segue
 *       - in: path
 *         name: seguidoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário seguido
 *     responses:
 *       200:
 *         description: Relacionamento removido com sucesso
 *       404:
 *         description: Relacionamento não encontrado
 */
router.delete('/seguidores/:seguidorId/:seguidoId', SeguidoresController.deleteSeguidores);

export default router;
