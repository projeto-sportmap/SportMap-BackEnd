
import { Router } from 'express';
import * as AnuncioFavoritosController from '../controllers/anuncio_favoritos.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Anúncio Favoritos
 *   description: Gerenciamento dos anúncios favoritos
 */

/**
 * @swagger
 * /anuncio-favoritos:
 *   post:
 *     summary: Criar um anúncio favorito
 *     tags: [Anúncio Favoritos]
 *     responses:
 *       201:
 *         description: Anúncio favorito criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/anuncio-favoritos', AnuncioFavoritosController.createAnuncioFavoritos);

/**
 * @swagger
 * /anuncio-favoritos:
 *   get:
 *     summary: Listar todos os anúncios favoritos
 *     tags: [Anúncio Favoritos]
 *     responses:
 *       200:
 *         description: Lista de anúncios favoritos
 */
router.get('/anuncio-favoritos', AnuncioFavoritosController.getAllAnuncioFavoritos);

/**
 * @swagger
 * /anuncio-favoritos/{id}:
 *   get:
 *     summary: Buscar anúncio favorito por ID
 *     tags: [Anúncio Favoritos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do anúncio favorito
 *     responses:
 *       200:
 *         description: Anúncio favorito encontrado
 *       404:
 *         description: Anúncio favorito não encontrado
 */
router.get('/anuncio-favoritos/:id', AnuncioFavoritosController.getAnuncioFavoritosById);

/**
 * @swagger
 * /anuncio-favoritos/{id}:
 *   delete:
 *     summary: Excluir anúncio favorito por ID
 *     tags: [Anúncio Favoritos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do anúncio favorito
 *     responses:
 *       200:
 *         description: Anúncio favorito excluído com sucesso
 *       404:
 *         description: Anúncio favorito não encontrado
 */
router.delete('/anuncio-favoritos/:id', AnuncioFavoritosController.deleteAnuncioFavoritos);

export default router;
