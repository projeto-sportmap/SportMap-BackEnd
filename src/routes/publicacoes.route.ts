import { Router } from 'express';
import * as PublicacoesController from '../controllers/publicacoes.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
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
 * components:
 *   schemas:
 *     CreatePublicacao:
 *       type: object
 *       description: O autor é obtido do usuário autenticado. usuarioId é opcional e deve corresponder ao token quando informado.
 *       properties:
 *         usuarioId:
 *           type: integer
 *           minimum: 1
 *           description: ID opcional do usuário autor; deve corresponder ao usuário autenticado.
 *           example: 1
 *         esporteId:
 *           type: integer
 *           minimum: 1
 *           maximum: 2147483647
 *           nullable: true
 *           example: 2
 *         conteudo:
 *           type: string
 *           maxLength: 5000
 *           nullable: true
 *           description: Texto em branco é salvo como vazio (null).
 *           example: Hoje foi um ótimo dia para praticar esportes!
 *         latitude:
 *           type: number
 *           format: double
 *           minimum: -90
 *           maximum: 90
 *           nullable: true
 *           description: Deve ser enviada junto com longitude.
 *           example: -22.9235
 *         longitude:
 *           type: number
 *           format: double
 *           minimum: -180
 *           maximum: 180
 *           nullable: true
 *           description: Deve ser enviada junto com latitude.
 *           example: -45.4613
 *     UpdatePublicacao:
 *       type: object
 *       description: Todos os campos são opcionais, mas é preciso informar pelo menos um. Latitude e longitude devem ser enviadas juntas. O autor (usuarioId) não pode ser alterado.
 *       minProperties: 1
 *       properties:
 *         esporteId:
 *           type: integer
 *           minimum: 1
 *           maximum: 2147483647
 *           nullable: true
 *           example: 2
 *         conteudo:
 *           type: string
 *           maxLength: 5000
 *           nullable: true
 *           example: Conteúdo atualizado da publicação.
 *         latitude:
 *           type: number
 *           format: double
 *           minimum: -90
 *           maximum: 90
 *           nullable: true
 *           example: -22.9235
 *         longitude:
 *           type: number
 *           format: double
 *           minimum: -180
 *           maximum: 180
 *           nullable: true
 *           example: -45.4613
 */

/**
 * @swagger
 * /publicacoes:
 *   post:
 *     summary: Criar uma publicação
 *     tags: [Publicações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePublicacao'
 *     responses:
 *       201:
 *         description: Publicação criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Autenticação ausente ou inválida
 *       403:
 *         description: usuarioId diferente do usuário autenticado
 *       404:
 *         description: Usuário ou esporte não encontrado
 */
router.post('/publicacoes', authMiddleware, validate(createPublicacaoSchema), PublicacoesController.createPublicacao);

/**
 * @swagger
 * /publicacoes:
 *   get:
 *     summary: Listar publicações
 *     tags: [Publicações]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrar pelo ID do usuário autor
 *       - in: query
 *         name: esporteId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrar pelo ID do esporte
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
 *             $ref: '#/components/schemas/UpdatePublicacao'
 *     responses:
 *       200:
 *         description: Publicação atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Publicação ou esporte não encontrado
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
 *       204:
 *         description: Publicação excluída com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Publicação não encontrada
 */
router.delete('/publicacoes/:id', validate(publicacaoIdSchema), PublicacoesController.deletePublicacao);

export default router;
