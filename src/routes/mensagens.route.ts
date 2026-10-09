
import { Router } from 'express';
import * as MensagensController from '../controllers/mensagens.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Mensagens
 *   description: Gerenciamento das mensagens
 */

/**
 * @swagger
 * /mensagens:
 *   post:
 *     summary: Criar uma mensagem
 *     tags: [Mensagens]
 *     responses:
 *       201:
 *         description: Mensagem criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/mensagens', MensagensController.createMensagens);

/**
 * @swagger
 * /mensagens:
 *   get:
 *     summary: Listar todas as mensagens
 *     tags: [Mensagens]
 *     responses:
 *       200:
 *         description: Lista de mensagens retornada com sucesso
 */
router.get('/mensagens', MensagensController.getAllMensagens);

/**
 * @swagger
 * /mensagens/{id}:
 *   get:
 *     summary: Buscar mensagem por ID
 *     tags: [Mensagens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mensagem
 *     responses:
 *       200:
 *         description: Mensagem encontrada
 *       404:
 *         description: Mensagem não encontrada
 */
router.get('/mensagens/:id', MensagensController.getMensagensById);

/**
 * @swagger
 * /mensagens/{id}/lida:
 *   patch:
 *     summary: Marcar mensagem como lida
 *     tags: [Mensagens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mensagem
 *     responses:
 *       200:
 *         description: Mensagem marcada como lida com sucesso
 *       404:
 *         description: Mensagem não encontrada
 */
router.patch('/mensagens/:id/lida', MensagensController.marcarComoLida);

/**
 * @swagger
 * /mensagens/{id}:
 *   delete:
 *     summary: Excluir mensagem
 *     tags: [Mensagens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mensagem
 *     responses:
 *       200:
 *         description: Mensagem excluída com sucesso
 *       404:
 *         description: Mensagem não encontrada
 */
router.delete('/mensagens/:id', MensagensController.deleteMensagens);

export default router;
