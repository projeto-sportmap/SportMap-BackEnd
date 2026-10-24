import { Router } from 'express';
import * as CompartilhamentosController from '../controllers/compartilhamentos.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Compartilhamentos
 *   description: Gerenciamento dos compartilhamentos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCompartilhamento:
 *       type: object
 *       required:
 *         - publicacaoId
 *         - usuarioId
 *       properties:
 *         publicacaoId:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           description: ID da publicação compartilhada (também aceita número em formato de texto, ex. "1").
 *           example: 1
 *         usuarioId:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           description: ID do usuário que compartilha (também aceita número em formato de texto).
 *           example: 1
 */

/**
 * @swagger
 * /compartilhamentos:
 *   post:
 *     summary: Criar um compartilhamento
 *     tags: [Compartilhamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCompartilhamento'
 *     responses:
 *       201:
 *         description: Compartilhamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Publicação ou usuário não encontrado
 */
router.post('/compartilhamentos', CompartilhamentosController.createCompartilhamentos);

/**
 * @swagger
 * /compartilhamentos:
 *   get:
 *     summary: Listar todos os compartilhamentos
 *     tags: [Compartilhamentos]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Quantidade máxima de registros retornados (valores fora de 1 a 100 são ajustados para esse intervalo)
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Quantidade de registros a pular (paginação)
 *     responses:
 *       200:
 *         description: Lista de compartilhamentos retornada com sucesso
 *       400:
 *         description: Parâmetros de consulta inválidos
 */
router.get('/compartilhamentos', CompartilhamentosController.getAllCompartilhamentos);

/**
 * @swagger
 * /compartilhamentos/{id}:
 *   get:
 *     summary: Buscar compartilhamento por ID
 *     tags: [Compartilhamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID do compartilhamento
 *     responses:
 *       200:
 *         description: Compartilhamento encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Compartilhamento não encontrado
 */
router.get('/compartilhamentos/:id', CompartilhamentosController.getCompartilhamentosById);

/**
 * @swagger
 * /compartilhamentos/{id}:
 *   delete:
 *     summary: Excluir um compartilhamento
 *     tags: [Compartilhamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID do compartilhamento
 *     responses:
 *       204:
 *         description: Compartilhamento excluído com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Compartilhamento não encontrado
 */
router.delete('/compartilhamentos/:id', CompartilhamentosController.deleteCompartilhamentos);

export default router;