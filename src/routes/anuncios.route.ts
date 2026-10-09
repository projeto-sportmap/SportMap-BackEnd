
import { Router } from 'express';
import * as AnunciosController from '../controllers/anuncios.controller.js';
import { authenticate } from '../middlewares/authenticate.middlewares.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Anúncios
 *   description: Gerenciamento dos anúncios
 */

/**
 * @swagger
 * /anuncios:
 *   post:
 *     summary: Criar um anúncio
 *     tags: [Anúncios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Anúncio criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.post('/anuncios', authenticate, AnunciosController.createAnuncios);

/**
 * @swagger
 * /anuncios:
 *   get:
 *     summary: Listar todos os anúncios
 *     tags: [Anúncios]
 *     responses:
 *       200:
 *         description: Lista de anúncios
 */
router.get('/anuncios', AnunciosController.getAllAnuncios);

/**
 * @swagger
 * /anuncios/{id}:
 *   get:
 *     summary: Buscar anúncio por ID
 *     tags: [Anúncios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do anúncio
 *     responses:
 *       200:
 *         description: Anúncio encontrado
 *       404:
 *         description: Anúncio não encontrado
 */
router.get('/anuncios/:id', AnunciosController.getAnunciosById);

/**
 * @swagger
 * /anuncios/{id}:
 *   put:
 *     summary: Atualizar um anúncio
 *     tags: [Anúncios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do anúncio
 *     responses:
 *       200:
 *         description: Anúncio atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Anúncio não encontrado
 */
router.put('/anuncios/:id', authenticate, AnunciosController.updateAnuncios);

/**
 * @swagger
 * /anuncios/{id}:
 *   delete:
 *     summary: Remover um anúncio
 *     tags: [Anúncios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do anúncio
 *     responses:
 *       200:
 *         description: Anúncio removido com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Anúncio não encontrado
 */
router.delete('/anuncios/:id', authenticate, AnunciosController.removerAnuncios);

export default router;
