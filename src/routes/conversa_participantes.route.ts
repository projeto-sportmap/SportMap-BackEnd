
import { Router } from 'express';
import * as ConversaParticipantesController from '../controllers/conversa_participantes.controller.js';

// Colocar middleware
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Conversa Participantes
 *   description: Gerenciamento dos participantes das conversas
 */

/**
 * @swagger
 * /conversa-participantes:
 *   post:
 *     summary: Adicionar participante a uma conversa
 *     tags: [Conversa Participantes]
 *     responses:
 *       201:
 *         description: Participante adicionado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/conversa-participantes', ConversaParticipantesController.createConversaParticipantes);

/**
 * @swagger
 * /conversa-participantes:
 *   get:
 *     summary: Listar todos os participantes das conversas
 *     tags: [Conversa Participantes]
 *     responses:
 *       200:
 *         description: Lista de participantes retornada com sucesso
 */
router.get('/conversa-participantes', ConversaParticipantesController.getAllConversaParticipantes);

/**
 * @swagger
 * /conversa-participantes/{id}:
 *   get:
 *     summary: Buscar participante por ID
 *     tags: [Conversa Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do participante da conversa
 *     responses:
 *       200:
 *         description: Participante encontrado
 *       404:
 *         description: Participante não encontrado
 */
router.get('/conversa-participantes/:id', ConversaParticipantesController.getConversaParticipantesById);

/**
 * @swagger
 * /conversa-participantes/{id}:
 *   delete:
 *     summary: Remover participante de uma conversa
 *     tags: [Conversa Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do participante da conversa
 *     responses:
 *       200:
 *         description: Participante removido com sucesso
 *       404:
 *         description: Participante não encontrado
 */
router.delete('/conversa-participantes/:id', ConversaParticipantesController.deleteConversaParticipantes);

export default router;
