
import { Router } from 'express';
import * as ConversasController from '../controllers/conversas.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Conversas
 *   description: Gerenciamento das conversas
 */

/**
 * @swagger
 * /conversas:
 *   post:
 *     summary: Criar uma conversa
 *     tags: [Conversas]
 *     responses:
 *       201:
 *         description: Conversa criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/conversas', ConversasController.createConversas);

/**
 * @swagger
 * /conversas:
 *   get:
 *     summary: Listar todas as conversas
 *     tags: [Conversas]
 *     responses:
 *       200:
 *         description: Lista de conversas retornada com sucesso
 */
router.get('/conversas', ConversasController.getAllConversas);

/**
 * @swagger
 * /conversas/{id}:
 *   get:
 *     summary: Buscar conversa por ID
 *     tags: [Conversas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da conversa
 *     responses:
 *       200:
 *         description: Conversa encontrada
 *       404:
 *         description: Conversa não encontrada
 */
router.get('/conversas/:id', ConversasController.getConversasById);

/**
 * @swagger
 * /conversas/{id}:
 *   delete:
 *     summary: Excluir uma conversa
 *     tags: [Conversas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da conversa
 *     responses:
 *       200:
 *         description: Conversa excluída com sucesso
 *       404:
 *         description: Conversa não encontrada
 */
router.delete('/conversas/:id', ConversasController.deleteConversas);

export default router;
