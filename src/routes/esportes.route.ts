import { Router } from 'express';
import * as EsportesController from '../controllers/esportes.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Esportes
 *   description: Gerenciamento dos esportes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateEsporte:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Nome do esporte. Espaços no início e no fim são removidos.
 *           example: Futebol
 *     UpdateEsporte:
 *       type: object
 *       description: Informe pelo menos um campo.
 *       minProperties: 1
 *       properties:
 *         nome:
 *           type: string
 *           maxLength: 50
 *           example: Futsal
 */

/**
 * @swagger
 * /esportes:
 *   post:
 *     summary: Cadastrar um esporte
 *     tags: [Esportes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEsporte'
 *     responses:
 *       201:
 *         description: Esporte cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/esportes', EsportesController.createEsporte);

/**
 * @swagger
 * /esportes:
 *   get:
 *     summary: Listar todos os esportes
 *     tags: [Esportes]
 *     responses:
 *       200:
 *         description: Lista de esportes retornada com sucesso
 */
router.get('/esportes', EsportesController.getAllEsportes);

/**
 * @swagger
 * /esportes/{id}:
 *   get:
 *     summary: Buscar esporte por ID
 *     tags: [Esportes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 2147483647
 *         description: ID do esporte
 *     responses:
 *       200:
 *         description: Esporte encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Esporte não encontrado
 */
router.get('/esportes/:id', EsportesController.getEsportesById);

/**
 * @swagger
 * /esportes/{id}:
 *   put:
 *     summary: Atualizar um esporte
 *     tags: [Esportes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 2147483647
 *         description: ID do esporte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEsporte'
 *     responses:
 *       200:
 *         description: Esporte atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Esporte não encontrado
 */
router.put('/esportes/:id', EsportesController.updateEsportes);

/**
 * @swagger
 * /esportes/{id}:
 *   delete:
 *     summary: Excluir um esporte
 *     tags: [Esportes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 2147483647
 *         description: ID do esporte
 *     responses:
 *       204:
 *         description: Esporte excluído com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Esporte não encontrado
 */
router.delete('/esportes/:id', EsportesController.deleteEsportes);

export default router;