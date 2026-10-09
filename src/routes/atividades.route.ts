
import { Router } from 'express';
import * as AtividadesController from '../controllers/atividades.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Atividades
 *   description: Gerenciamento das atividades
 */

/**
 * @swagger
 * /atividades:
 *   post:
 *     summary: Criar uma atividade
 *     tags: [Atividades]
 *     responses:
 *       201:
 *         description: Atividade criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/atividades', AtividadesController.createAtividades);

/**
 * @swagger
 * /atividades:
 *   get:
 *     summary: Listar todas as atividades
 *     tags: [Atividades]
 *     responses:
 *       200:
 *         description: Lista de atividades retornada com sucesso
 */
router.get('/atividades', AtividadesController.getAllAtividades);

/**
 * @swagger
 * /atividades/{id}:
 *   get:
 *     summary: Buscar atividade por ID
 *     tags: [Atividades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: Atividade encontrada
 *       404:
 *         description: Atividade não encontrada
 */
router.get('/atividades/:id', AtividadesController.getAtividadesById);

/**
 * @swagger
 * /atividades/{id}:
 *   put:
 *     summary: Atualizar uma atividade
 *     tags: [Atividades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: Atividade atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Atividade não encontrada
 */
router.put('/atividades/:id', AtividadesController.updateAtividades);

/**
 * @swagger
 * /atividades/{id}/cancelar:
 *   patch:
 *     summary: Cancelar uma atividade
 *     tags: [Atividades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: Atividade cancelada com sucesso
 *       400:
 *         description: Não foi possível cancelar a atividade
 *       404:
 *         description: Atividade não encontrada
 */
router.patch('/atividades/:id/cancelar', AtividadesController.cancelarAtividades);

/**
 * @swagger
 * /atividades/{id}:
 *   delete:
 *     summary: Excluir uma atividade
 *     tags: [Atividades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: Atividade excluída com sucesso
 *       404:
 *         description: Atividade não encontrada
 */
router.delete('/atividades/:id', AtividadesController.deleteAtividades);

export default router;
