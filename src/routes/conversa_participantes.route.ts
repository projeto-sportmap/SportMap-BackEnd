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
 * components:
 *   schemas:
 *     CreateConversaParticipante:
 *       type: object
 *       required:
 *         - conversaId
 *         - usuarioId
 *       properties:
 *         conversaId:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           description: ID da conversa (também aceita número em formato de texto, ex. "1").
 *           example: 1
 *         usuarioId:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           description: ID do usuário que entra na conversa (também aceita número em formato de texto).
 *           example: 1
 */

/**
 * @swagger
 * /conversa-participantes:
 *   post:
 *     summary: Adicionar participante a uma conversa
 *     tags: [Conversa Participantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateConversaParticipante'
 *     responses:
 *       201:
 *         description: Participante adicionado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Conversa ou usuário não encontrado
 *       409:
 *         description: Usuário já participa desta conversa
 */
router.post('/conversa-participantes', ConversaParticipantesController.createConversaParticipantes);

/**
 * @swagger
 * /conversa-participantes:
 *   get:
 *     summary: Listar todos os participantes das conversas
 *     tags: [Conversa Participantes]
 *     parameters:
 *       - in: query
 *         name: conversaId
 *         required: false
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: Filtrar pelos participantes de uma conversa
 *       - in: query
 *         name: usuarioId
 *         required: false
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: Filtrar pelas conversas de um usuário
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
 *         description: Lista de participantes retornada com sucesso
 *       400:
 *         description: Parâmetros de consulta inválidos
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
 *           format: int64
 *           minimum: 1
 *         description: ID do participante da conversa
 *     responses:
 *       200:
 *         description: Participante encontrado
 *       400:
 *         description: ID inválido
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
 *           format: int64
 *           minimum: 1
 *         description: ID do participante da conversa
 *     responses:
 *       204:
 *         description: Participante removido com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Participante não encontrado
 */
router.delete('/conversa-participantes/:id', ConversaParticipantesController.deleteConversaParticipantes);

export default router;