
import { Router } from 'express';
import * as MidiasController from '../controllers/publimidia.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import {
  createPublicacaoMidiaSchema,
  updatePublicacaoMidiaSchema,
  publicacaoMidiaIdSchema,
  listPublicacaoMidiasSchema,
} from '../schemas/publimidia.schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Mídias de Publicações
 *   description: Gerenciamento das mídias vinculadas às publicações
 */

/**
 * @swagger
 * /publicacao-midias:
 *   post:
 *     summary: Adicionar mídia a uma publicação
 *     tags: [Mídias de Publicações]
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
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: https://exemplo.com/imagem.jpg
 *               tipo:
 *                 type: string
 *                 example: imagem
 *     responses:
 *       201:
 *         description: Mídia adicionada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/publicacao-midias', validate(createPublicacaoMidiaSchema), MidiasController.createPublicacaoMidia);

/**
 * @swagger
 * /publicacao-midias:
 *   get:
 *     summary: Listar mídias das publicações
 *     tags: [Mídias de Publicações]
 *     responses:
 *       200:
 *         description: Lista de mídias retornada com sucesso
 *       400:
 *         description: Parâmetros de consulta inválidos
 */
router.get('/publicacao-midias', validate(listPublicacaoMidiasSchema), MidiasController.getAllPublicacaoMidias);

/**
 * @swagger
 * /publicacao-midias/{id}:
 *   get:
 *     summary: Buscar mídia por ID
 *     tags: [Mídias de Publicações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mídia
 *     responses:
 *       200:
 *         description: Mídia encontrada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Mídia não encontrada
 */
router.get('/publicacao-midias/:id', validate(publicacaoMidiaIdSchema), MidiasController.getPublicacaoMidiaById);

/**
 * @swagger
 * /publicacao-midias/{id}:
 *   put:
 *     summary: Atualizar mídia de uma publicação
 *     tags: [Mídias de Publicações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mídia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: https://exemplo.com/imagem-atualizada.jpg
 *               tipo:
 *                 type: string
 *                 example: imagem
 *     responses:
 *       200:
 *         description: Mídia atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Mídia não encontrada
 */
router.put('/publicacao-midias/:id', validate(updatePublicacaoMidiaSchema), MidiasController.updatePublicacaoMidia);

/**
 * @swagger
 * /publicacao-midias/{id}:
 *   delete:
 *     summary: Excluir mídia de uma publicação
 *     tags: [Mídias de Publicações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mídia
 *     responses:
 *       200:
 *         description: Mídia excluída com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Mídia não encontrada
 */
router.delete('/publicacao-midias/:id', validate(publicacaoMidiaIdSchema), MidiasController.deletePublicacaoMidia);

export default router;
