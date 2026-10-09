
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
 * /compartilhamentos:
 *   post:
 *     summary: Criar um compartilhamento
 *     tags: [Compartilhamentos]
 *     responses:
 *       201:
 *         description: Compartilhamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/compartilhamentos', CompartilhamentosController.createCompartilhamentos);

/**
 * @swagger
 * /compartilhamentos:
 *   get:
 *     summary: Listar todos os compartilhamentos
 *     tags: [Compartilhamentos]
 *     responses:
 *       200:
 *         description: Lista de compartilhamentos retornada com sucesso
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
 *         description: ID do compartilhamento
 *     responses:
 *       200:
 *         description: Compartilhamento encontrado
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
 *         description: ID do compartilhamento
 *     responses:
 *       200:
 *         description: Compartilhamento excluído com sucesso
 *       404:
 *         description: Compartilhamento não encontrado
 */
router.delete('/compartilhamentos/:id', CompartilhamentosController.deleteCompartilhamentos);

export default router;
