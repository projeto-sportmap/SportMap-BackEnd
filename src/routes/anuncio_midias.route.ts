
import { Router } from 'express';
import * as AnuncioMidiasController from '../controllers/anuncio_midias.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Anúncio Mídias
 *   description: Gerenciamento das mídias dos anúncios
 */

/**
 * @swagger
 * /anuncio-midias:
 *   post:
 *     summary: Criar uma mídia de anúncio
 *     tags: [Anúncio Mídias]
 *     responses:
 *       201:
 *         description: Mídia criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/anuncio-midias', AnuncioMidiasController.createAnuncioMidias);

/**
 * @swagger
 * /anuncio-midias:
 *   get:
 *     summary: Listar todas as mídias dos anúncios
 *     tags: [Anúncio Mídias]
 *     responses:
 *       200:
 *         description: Lista de mídias dos anúncios
 */
router.get('/anuncio-midias', AnuncioMidiasController.getAllAnuncioMidias);

/**
 * @swagger
 * /anuncio-midias/{id}:
 *   get:
 *     summary: Buscar mídia de anúncio por ID
 *     tags: [Anúncio Mídias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mídia
 *     responses:
 *       200:
 *         description: Mídia encontrada
 *       404:
 *         description: Mídia não encontrada
 */
router.get('/anuncio-midias/:id', AnuncioMidiasController.getAnuncioMidiasById);

/**
 * @swagger
 * /anuncio-midias/{id}:
 *   put:
 *     summary: Atualizar mídia de anúncio
 *     tags: [Anúncio Mídias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mídia
 *     responses:
 *       200:
 *         description: Mídia atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Mídia não encontrada
 */
router.put('/anuncio-midias/:id', AnuncioMidiasController.updateAnuncioMidias);

/**
 * @swagger
 * /anuncio-midias/{id}:
 *   delete:
 *     summary: Excluir mídia de anúncio
 *     tags: [Anúncio Mídias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mídia
 *     responses:
 *       200:
 *         description: Mídia excluída com sucesso
 *       404:
 *         description: Mídia não encontrada
 */
router.delete('/anuncio-midias/:id', AnuncioMidiasController.deleteAnuncioMidias);

export default router;
