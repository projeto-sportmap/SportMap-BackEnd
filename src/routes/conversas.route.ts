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
 *     description: Não precisa enviar nenhum dado. A conversa é criada vazia e o id é gerado automaticamente.
 *     responses:
 *       201:
 *         description: Conversa criada com sucesso
 */
router.post('/conversas', ConversasController.createConversas);

/**
 * @swagger
 * /conversas:
 *   get:
 *     summary: Listar todas as conversas
 *     tags: [Conversas]
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
 *         description: Lista de conversas retornada com sucesso
 *       400:
 *         description: Parâmetros de consulta inválidos
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
 *           format: int64
 *           minimum: 1
 *         description: ID da conversa
 *     responses:
 *       200:
 *         description: Conversa encontrada
 *       400:
 *         description: ID inválido
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
 *           format: int64
 *           minimum: 1
 *         description: ID da conversa
 *     responses:
 *       204:
 *         description: Conversa excluída com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Conversa não encontrada
 */
router.delete('/conversas/:id', ConversasController.deleteConversas);

export default router;