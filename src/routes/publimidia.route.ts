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
 * components:
 *   schemas:
 *     CreatePublicacaoMidia:
 *       type: object
 *       required:
 *         - publicacaoId
 *         - tipo
 *         - url
 *       properties:
 *         publicacaoId:
 *           type: integer
 *           minimum: 1
 *           description: ID da publicação (também aceita número em formato de texto, ex. "1").
 *           example: 1
 *         tipo:
 *           type: string
 *           enum: [imagem, video]
 *           example: imagem
 *         url:
 *           type: string
 *           maxLength: 500
 *           pattern: '^https?://\S+$'
 *           description: Deve começar com http:// ou https://.
 *           example: https://exemplo.com/imagem.jpg
 *         ordem:
 *           type: integer
 *           minimum: 0
 *           maximum: 32767
 *           description: Posição da mídia na publicação. Se omitida, usa a próxima posição livre.
 *           example: 0
 *     UpdatePublicacaoMidia:
 *       type: object
 *       description: Todos os campos são opcionais, mas é preciso informar pelo menos um. A publicação da mídia não pode ser alterada.
 *       minProperties: 1
 *       properties:
 *         tipo:
 *           type: string
 *           enum: [imagem, video]
 *           example: imagem
 *         url:
 *           type: string
 *           maxLength: 500
 *           pattern: '^https?://\S+$'
 *           description: Deve começar com http:// ou https://.
 *           example: https://exemplo.com/imagem-atualizada.jpg
 *         ordem:
 *           type: integer
 *           minimum: 0
 *           maximum: 32767
 *           example: 1
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
 *             $ref: '#/components/schemas/CreatePublicacaoMidia'
 *     responses:
 *       201:
 *         description: Mídia adicionada com sucesso
 *       400:
 *         description: Dados inválidos ou limite de mídias da publicação atingido
 *       404:
 *         description: Publicação não encontrada
 *       409:
 *         description: Já existe uma mídia nesta posição da publicação
 */
router.post('/publicacao-midias', validate(createPublicacaoMidiaSchema), MidiasController.createPublicacaoMidia);

/**
 * @swagger
 * /publicacao-midias:
 *   get:
 *     summary: Listar mídias das publicações
 *     tags: [Mídias de Publicações]
 *     description: Ordenadas pela publicação e depois pela posição (ordem).
 *     parameters:
 *       - in: query
 *         name: publicacaoId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrar pelo ID da publicação
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
 *             $ref: '#/components/schemas/UpdatePublicacaoMidia'
 *     responses:
 *       200:
 *         description: Mídia atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Mídia não encontrada
 *       409:
 *         description: Já existe uma mídia nesta posição da publicação
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
 *       204:
 *         description: Mídia excluída com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Mídia não encontrada
 */
router.delete('/publicacao-midias/:id', validate(publicacaoMidiaIdSchema), MidiasController.deletePublicacaoMidia);

export default router;