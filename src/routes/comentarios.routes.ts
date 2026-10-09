
// Arquivo: src/routes/comentarios.routes.ts

import { Router } from 'express';
import * as ComentariosController from '../controllers/comentarios.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { authenticate } from '../middlewares/authenticate.middlewares.js';
import {
  createComentarioSchema,
  updateComentarioSchema,
} from '../schemas/comentarios.schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comentários
 *   description: Gerenciamento dos comentários das publicações
 */

/**
 * @swagger
 * /publicacoes/{publicacaoId}/comentarios:
 *   get:
 *     summary: Listar comentários de uma publicação
 *     tags: [Comentários]
 *     parameters:
 *       - in: path
 *         name: publicacaoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da publicação
 *     responses:
 *       200:
 *         description: Comentários listados com sucesso
 *       404:
 *         description: Publicação não encontrada
 */
router.get(
  '/publicacoes/:publicacaoId/comentarios',
  ComentariosController.getComentariosByPublicacao,
);

/**
 * @swagger
 * /publicacoes/{publicacaoId}/comentarios:
 *   post:
 *     summary: Criar um comentário em uma publicação
 *     tags: [Comentários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicacaoId
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
 *                 example: Excelente publicação!
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 */
router.post(
  '/publicacoes/:publicacaoId/comentarios',
  authenticate,
  validate(createComentarioSchema),
  ComentariosController.createComentario,
);

/**
 * @swagger
 * /comentarios/{id}:
 *   get:
 *     summary: Buscar comentário por ID
 *     tags: [Comentários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do comentário
 *     responses:
 *       200:
 *         description: Comentário encontrado
 *       404:
 *         description: Comentário não encontrado
 */
router.get('/comentarios/:id', ComentariosController.getComentarioById);

/**
 * @swagger
 * /comentarios/{id}:
 *   patch:
 *     summary: Atualizar parcialmente um comentário
 *     tags: [Comentários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do comentário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conteudo:
 *                 type: string
 *                 example: Comentário atualizado!
 *     responses:
 *       200:
 *         description: Comentário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Comentário não encontrado
 */
router.patch(
  '/comentarios/:id',
  authenticate,
  validate(updateComentarioSchema),
  ComentariosController.updateComentario,
);

/**
 * @swagger
 * /comentarios/{id}:
 *   delete:
 *     summary: Excluir um comentário
 *     tags: [Comentários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do comentário
 *     responses:
 *       200:
 *         description: Comentário excluído com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Comentário não encontrado
 */
router.delete(
  '/comentarios/:id',
  authenticate,
  ComentariosController.deleteComentario,
);

export default router;
