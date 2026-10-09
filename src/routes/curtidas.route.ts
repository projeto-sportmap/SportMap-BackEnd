
import { Router } from 'express';
import * as CurtidasController from '../controllers/curtidas.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import {
  createCurtidaSchema,
  curtidaIdSchema,
  listCurtidasSchema,
} from '../schemas/curtidas.schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Curtidas
 *   description: Gerenciamento das curtidas
 */

/**
 * @swagger
 * /curtidas:
 *   post:
 *     summary: Criar uma curtida
 *     tags: [Curtidas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicacaoId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Curtida criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/curtidas', validate(createCurtidaSchema), CurtidasController.createCurtida);

/**
 * @swagger
 * /curtidas:
 *   get:
 *     summary: Listar curtidas
 *     tags: [Curtidas]
 *     responses:
 *       200:
 *         description: Lista de curtidas retornada com sucesso
 *       400:
 *         description: Parâmetros de consulta inválidos
 */
router.get('/curtidas', validate(listCurtidasSchema), CurtidasController.getAllCurtidas);

/**
 * @swagger
 * /curtidas/{id}:
 *   get:
 *     summary: Buscar curtida por ID
 *     tags: [Curtidas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da curtida
 *     responses:
 *       200:
 *         description: Curtida encontrada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Curtida não encontrada
 */
router.get('/curtidas/:id', validate(curtidaIdSchema), CurtidasController.getCurtidaById);

/**
 * @swagger
 * /curtidas/{id}:
 *   delete:
 *     summary: Excluir uma curtida
 *     tags: [Curtidas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da curtida
 *     responses:
 *       200:
 *         description: Curtida excluída com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Curtida não encontrada
 */
router.delete('/curtidas/:id', validate(curtidaIdSchema), CurtidasController.deleteCurtida);

export default router;
