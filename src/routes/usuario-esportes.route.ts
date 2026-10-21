import { Router } from 'express';
import * as UsuarioEsportesController from '../controllers/usuario-esportes.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import {
  createUsuarioEsporteSchema,
  updateUsuarioEsporteSchema,
  usuarioEsporteIdSchema,
  listUsuarioEsportesSchema,
} from '../schemas/usuario-esportes.schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuário Esportes
 *   description: Gerenciamento dos esportes praticados pelos usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUsuarioEsporte:
 *       type: object
 *       required:
 *         - usuarioId
 *         - esporteId
 *       properties:
 *         usuarioId:
 *           type: integer
 *           minimum: 1
 *           description: ID do usuário (também aceita número em formato de texto, ex. "1").
 *           example: 1
 *         esporteId:
 *           type: integer
 *           minimum: 1
 *           maximum: 2147483647
 *           example: 2
 *         nivel:
 *           type: string
 *           enum: [iniciante, intermediario, avancado, profissional]
 *           description: Se omitido, o padrão é "iniciante".
 *           example: "iniciante"
 *     UpdateUsuarioEsporte:
 *       type: object
 *       description: Só o nível pode ser alterado.
 *       required:
 *         - nivel
 *       properties:
 *         nivel:
 *           type: string
 *           enum: [iniciante, intermediario, avancado, profissional]
 *           example: "intermediario"
 */

/**
 * @swagger
 * /usuario-esportes:
 *   post:
 *     summary: Vincular um esporte a um usuário
 *     tags: [Usuário Esportes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUsuarioEsporte'
 *     responses:
 *       201:
 *         description: Esporte vinculado ao usuário com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/usuario-esportes', validate(createUsuarioEsporteSchema), UsuarioEsportesController.createUsuarioEsporte);

/**
 * @swagger
 * /usuario-esportes:
 *   get:
 *     summary: Listar vínculos entre usuários e esportes
 *     tags: [Usuário Esportes]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrar pelo ID do usuário
 *       - in: query
 *         name: esporteId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrar pelo ID do esporte
 *     responses:
 *       200:
 *         description: Lista de vínculos retornada com sucesso
 *       400:
 *         description: Parâmetros de consulta inválidos
 */
router.get('/usuario-esportes', validate(listUsuarioEsportesSchema), UsuarioEsportesController.getAllUsuarioEsportes);

/**
 * @swagger
 * /usuario-esportes/{id}:
 *   get:
 *     summary: Buscar vínculo entre usuário e esporte por ID
 *     tags: [Usuário Esportes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do vínculo
 *     responses:
 *       200:
 *         description: Vínculo encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Vínculo não encontrado
 */
router.get('/usuario-esportes/:id', validate(usuarioEsporteIdSchema), UsuarioEsportesController.getUsuarioEsporteById);

/**
 * @swagger
 * /usuario-esportes/{id}:
 *   put:
 *     summary: Atualizar o nível do vínculo entre usuário e esporte
 *     tags: [Usuário Esportes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do vínculo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUsuarioEsporte'
 *     responses:
 *       200:
 *         description: Vínculo atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Vínculo não encontrado
 */
router.put('/usuario-esportes/:id', validate(updateUsuarioEsporteSchema), UsuarioEsportesController.updateUsuarioEsporte);

/**
 * @swagger
 * /usuario-esportes/{id}:
 *   delete:
 *     summary: Remover vínculo entre usuário e esporte
 *     tags: [Usuário Esportes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do vínculo
 *     responses:
 *       200:
 *         description: Vínculo removido com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Vínculo não encontrado
 */
router.delete('/usuario-esportes/:id', validate(usuarioEsporteIdSchema), UsuarioEsportesController.deleteUsuarioEsporte);

export default router;