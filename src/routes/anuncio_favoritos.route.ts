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
 * components:
 *   schemas:
 *     CreateAnuncioFavorito:
 *       type: object
 *       required:
 *         - usuarioId
 *         - anuncioId
 *       properties:
 *         usuarioId:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           description: ID do usuário que favorita o anúncio (também aceita número em formato de texto, ex. "1").
 *           example: 1
 *         anuncioId:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           description: ID do anúncio favoritado (também aceita número em formato de texto).
 *           example: 1
 */

/**
 * @swagger
 * /anuncio-favoritos:
 *   post:
 *     summary: Criar um anúncio favorito
 *     tags: [Anúncio Favoritos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAnuncioFavorito'
 *     responses:
 *       201:
 *         description: Anúncio favorito criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário ou anúncio não encontrado (anúncios removidos também retornam este erro)
 *       409:
 *         description: Anúncio já está nos favoritos
 */
router.post('/anuncio-favoritos', AnuncioFavoritosController.createAnuncioFavoritos);

/**
 * @swagger
 * /anuncio-favoritos:
 *   get:
 *     summary: Listar todos os anúncios favoritos
 *     tags: [Anúncio Favoritos]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         required: false
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: Filtrar pelos favoritos de um usuário
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
 *         description: Lista de anúncios favoritos
 *       400:
 *         description: Parâmetros de consulta inválidos
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
 *           format: int64
 *           minimum: 1
 *         description: ID do anúncio favorito
 *     responses:
 *       200:
 *         description: Anúncio favorito encontrado
 *       400:
 *         description: ID inválido
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
 *           format: int64
 *           minimum: 1
 *         description: ID do anúncio favorito
 *     responses:
 *       204:
 *         description: Anúncio favorito excluído com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Anúncio favorito não encontrado
 */
router.delete('/anuncio-favoritos/:id', AnuncioFavoritosController.deleteAnuncioFavoritos);

export default router;