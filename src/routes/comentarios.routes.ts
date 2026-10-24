// Arquivo: src/routes/comentarios.routes.ts

import { Router } from 'express';
import * as ComentariosController from '../controllers/comentarios.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
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
 * components:
 *   schemas:
 *     CreateComentario:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - conteudo
 *       properties:
 *         conteudo:
 *           type: string
 *           minLength: 1
 *           maxLength: 300
 *           description: Texto do comentário. Espaços no início e no fim são removidos.
 *           example: Excelente publicação!
 *     UpdateComentario:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - conteudo
 *       properties:
 *         conteudo:
 *           type: string
 *           minLength: 1
 *           maxLength: 300
 *           description: Novo texto do comentário. Espaços no início e no fim são removidos.
 *           example: Comentário atualizado!
 */

/**
 * @swagger
 * /publicacoes/{publicacaoId}/comentarios:
 *   get:
 *     summary: Listar comentários de uma publicação
 *     tags: [Comentários]
 *     description: Se a publicação não existir ou não tiver comentários, retorna uma lista vazia.
 *     parameters:
 *       - in: path
 *         name: publicacaoId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID da publicação
 *     responses:
 *       200:
 *         description: Comentários listados com sucesso
 *       400:
 *         description: ID inválido
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
 *     description: O autor do comentário é o usuário autenticado (vem do token).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicacaoId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID da publicação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateComentario'
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Publicação não encontrada
 */
router.post(
  '/publicacoes/:publicacaoId/comentarios',
  authMiddleware,
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
 *           format: int64
 *           minimum: 1
 *         description: ID do comentário
 *     responses:
 *       200:
 *         description: Comentário encontrado
 *       400:
 *         description: ID inválido
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
 *     description: Somente o autor do comentário pode editá-lo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID do comentário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateComentario'
 *     responses:
 *       200:
 *         description: Comentário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Você não pode editar este comentário (não é o autor)
 *       404:
 *         description: Comentário não encontrado
 */
router.patch(
  '/comentarios/:id',
  authMiddleware,
  validate(updateComentarioSchema),
  ComentariosController.updateComentario,
);

/**
 * @swagger
 * /comentarios/{id}:
 *   delete:
 *     summary: Excluir um comentário
 *     tags: [Comentários]
 *     description: Somente o autor do comentário pode excluí-lo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID do comentário
 *     responses:
 *       204:
 *         description: Comentário excluído com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Você não pode apagar este comentário (não é o autor)
 *       404:
 *         description: Comentário não encontrado
 */
router.delete(
  '/comentarios/:id',
  authMiddleware,
  ComentariosController.deleteComentario,
);

export default router;