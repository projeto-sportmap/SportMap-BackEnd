
import { Router } from 'express';
import * as PublicacoesController from '../controllers/publicacoes.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import {
  createPublicacaoSchema,
  updatePublicacaoSchema,
  publicacaoIdSchema,
  listPublicacoesSchema,
} from '../schemas/publicacoes.schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Publicações
 *   description: Gerenciamento das publicações
 */

/**
 * @swagger
 * /publicacoes:
 *   post:
 *     summary: Criar uma publicação
 *     tags: [Publicações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conteudo:
 *                 type: string
 *                 example: Hoje foi um ótimo dia para praticar esportes!
 *     responses:
 *       201:
 *         description: Publicação criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/publicacoes', validate(createPublicacaoSchema), PublicacoesController.createPublicacao);

/**
 * @swagger
 * /publicacoes:
 *   get:
 *     summary: Listar publicações
 *     tags: [Publicações]
 *     responses:
 *       200:
 *         description: Lista de publicações retornada com sucesso
 *       400:
 *         description: Parâmetros de consulta inválidos
 */
router.get('/publicacoes', validate(listPublicacoesSchema), PublicacoesController.getAllPublicacoes);

/**
 * @swagger
 * /publicacoes/{id}:
 *   get:
 *     summary: Buscar publicação por ID
 *     tags: [Publicações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da publicação
 *     responses:
 *       200:
 *         description: Publicação encontrada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Publicação não encontrada
 */
router.get('/publicacoes/:id', validate(publicacaoIdSchema), PublicacoesController.getPublicacaoById);

/**
 * @swagger
 * /publicacoes/{id}:
 *   put:
 *     summary: Atualizar uma publicação
 *     tags: [Publicações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da publicação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conteudo:
 *                 type: string
 *                 example: Conteúdo atualizado da publicação.
 *     responses:
 *       200:
 *         description: Publicação atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Publicação não encontrada
 */
router.put('/publicacoes/:id', validate(updatePublicacaoSchema), PublicacoesController.updatePublicacao);

/**
 * @swagger
 * /publicacoes/{id}:
 *   delete:
 *     summary: Excluir uma publicação
 *     tags: [Publicações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da publicação
 *     responses:
 *       200:
 *         description: Publicação excluída com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Publicação não encontrada
 */
router.delete('/publicacoes/:id', validate(publicacaoIdSchema), PublicacoesController.deletePublicacao);

export default router;
