import { Router } from 'express';
import * as ComunidadesController from '../controllers/comunidades.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createComunidadeSchema,
  updateComunidadeSchema,
  comunidadeIdSchema,
} from '../schemas/comunidades.schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comunidades
 *   description: Gerenciamento das comunidades
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateComunidade:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         nome:
 *           type: string
 *           example: Skatistas de Pinda
 *         bio:
 *           type: string
 *           maxLength: 255
 *         fotoUrl:
 *           type: string
 *         esporteId:
 *           type: integer
 *         esporteNome:
 *           type: string
 *           example: Skate
 */

// Todas as rotas de comunidades exigem autenticação
router.use('/comunidades', authMiddleware);

/**
 * @swagger
 * /comunidades:
 *   post:
 *     summary: Criar uma comunidade (o criador entra como admin)
 *     tags: [Comunidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateComunidade'
 *     responses:
 *       201:
 *         description: Comunidade criada
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Já existe uma comunidade com esse nome
 */
router.post('/comunidades', validate(createComunidadeSchema), ComunidadesController.createComunidade);

/**
 * @swagger
 * /comunidades:
 *   get:
 *     summary: Listar comunidades
 *     tags: [Comunidades]
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get('/comunidades', ComunidadesController.getAllComunidades);

/**
 * @swagger
 * /comunidades/{id}:
 *   get:
 *     summary: Buscar comunidade por ID (com esporte, contagens e papel do usuário)
 *     tags: [Comunidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Comunidade encontrada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Comunidade não encontrada
 */
router.get('/comunidades/:id', validate(comunidadeIdSchema), ComunidadesController.getComunidadeById);

/**
 * @swagger
 * /comunidades/{id}:
 *   put:
 *     summary: Atualizar comunidade (apenas o criador)
 *     tags: [Comunidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateComunidade'
 *     responses:
 *       200:
 *         description: Comunidade atualizada
 *       403:
 *         description: Apenas o criador pode alterar
 *       404:
 *         description: Comunidade não encontrada
 */
router.put('/comunidades/:id', validate(updateComunidadeSchema), ComunidadesController.updateComunidade);

/**
 * @swagger
 * /comunidades/{id}:
 *   delete:
 *     summary: Excluir comunidade (apenas o criador)
 *     tags: [Comunidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       204:
 *         description: Comunidade excluída
 *       403:
 *         description: Apenas o criador pode excluir
 *       404:
 *         description: Comunidade não encontrada
 */
router.delete('/comunidades/:id', validate(comunidadeIdSchema), ComunidadesController.deleteComunidade);

/**
 * @swagger
 * /comunidades/{id}/publicacoes:
 *   get:
 *     summary: Listar publicações da comunidade
 *     tags: [Comunidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Lista de publicações
 *       404:
 *         description: Comunidade não encontrada
 */
router.get(
  '/comunidades/:id/publicacoes',
  validate(comunidadeIdSchema),
  ComunidadesController.getPublicacoesDaComunidade,
);

/**
 * @swagger
 * /comunidades/{id}/participar:
 *   post:
 *     summary: Entrar na comunidade
 *     tags: [Comunidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       201:
 *         description: Participação criada
 *       409:
 *         description: Você já participa desta comunidade
 */
router.post('/comunidades/:id/participar', validate(comunidadeIdSchema), ComunidadesController.participarComunidade);

/**
 * @swagger
 * /comunidades/{id}/participar:
 *   delete:
 *     summary: Sair da comunidade
 *     tags: [Comunidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       204:
 *         description: Você saiu da comunidade
 *       400:
 *         description: O criador não pode sair
 *       404:
 *         description: Você não participa desta comunidade
 */
router.delete('/comunidades/:id/participar', validate(comunidadeIdSchema), ComunidadesController.sairComunidade);

export default router;