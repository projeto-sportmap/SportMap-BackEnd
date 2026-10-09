
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
 * /usuario-esportes:
 *   post:
 *     summary: Vincular um esporte a um usuário
 *     tags: [Usuário Esportes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *                 example: 1
 *               esporteId:
 *                 type: integer
 *                 example: 2
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
 *     summary: Atualizar vínculo entre usuário e esporte
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
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *                 example: 1
 *               esporteId:
 *                 type: integer
 *                 example: 3
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
