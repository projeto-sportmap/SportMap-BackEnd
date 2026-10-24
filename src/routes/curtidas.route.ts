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
 * components:
 *   schemas:
 *     CreateCurtida:
 *       type: object
 *       required:
 *         - publicacaoId
 *         - usuarioId
 *       properties:
 *         publicacaoId:
 *           type: integer
 *           minimum: 1
 *           description: ID da publicação curtida (também aceita número em formato de texto, ex. "1").
 *           example: 1
 *         usuarioId:
 *           type: integer
 *           minimum: 1
 *           description: ID do usuário que curtiu (também aceita número em formato de texto, ex. "10").
 *           example: 10
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
 *             $ref: '#/components/schemas/CreateCurtida'
 *     responses:
 *       201:
 *         description: Curtida criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário ou publicação não encontrado
 *       409:
 *         description: Usuário já curtiu esta publicação
 */
router.post(
  '/curtidas',
  validate(createCurtidaSchema),
  CurtidasController.createCurtida,
);

/**
 * @swagger
 * /curtidas:
 *   get:
 *     summary: Listar curtidas
 *     tags: [Curtidas]
 *     description: Ordenadas da mais recente para a mais antiga.
 *     parameters:
 *       - in: query
 *         name: publicacaoId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrar pelas curtidas de uma publicação
 *       - in: query
 *         name: usuarioId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrar pelas curtidas de um usuário
 *     responses:
 *       200:
 *         description: Lista de curtidas retornada com sucesso
 *       400:
 *         description: Parâmetros de consulta inválidos
 */
router.get(
  '/curtidas',
  validate(listCurtidasSchema),
  CurtidasController.getAllCurtidas,
);

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
 *           minimum: 1
 *           maximum: 2147483647
 *         description: ID da curtida
 *     responses:
 *       200:
 *         description: Curtida encontrada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Curtida não encontrada
 */
router.get(
  '/curtidas/:id',
  validate(curtidaIdSchema),
  CurtidasController.getCurtidaById,
);

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
 *           minimum: 1
 *           maximum: 2147483647
 *         description: ID da curtida
 *     responses:
 *       204:
 *         description: Curtida excluída com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Curtida não encontrada
 */
router.delete(
  '/curtidas/:id',
  validate(curtidaIdSchema),
  CurtidasController.deleteCurtida,
);

export default router;