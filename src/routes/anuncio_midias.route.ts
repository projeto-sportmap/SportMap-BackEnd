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
 * components:
 *   schemas:
 *     CreateAnuncioMidia:
 *       type: object
 *       required:
 *         - anuncioId
 *         - url
 *       properties:
 *         anuncioId:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           description: ID do anúncio (também aceita número em formato de texto, ex. "1").
 *           example: 1
 *         url:
 *           type: string
 *           maxLength: 500
 *           description: URL válida da mídia. Espaços no início e no fim são removidos.
 *           example: https://exemplo.com/foto-anuncio.jpg
 *         ordem:
 *           type: integer
 *           minimum: 0
 *           maximum: 32767
 *           default: 0
 *           description: Posição da mídia no anúncio. Se omitida, usa 0. Não pode repetir dentro do mesmo anúncio.
 *           example: 0
 *     UpdateAnuncioMidia:
 *       type: object
 *       description: Todos os campos são opcionais, mas é preciso informar pelo menos um. O anúncio da mídia não pode ser alterado.
 *       minProperties: 1
 *       properties:
 *         url:
 *           type: string
 *           maxLength: 500
 *           description: URL válida da mídia.
 *           example: https://exemplo.com/foto-atualizada.jpg
 *         ordem:
 *           type: integer
 *           minimum: 0
 *           maximum: 32767
 *           description: Nova posição da mídia. Não pode repetir dentro do mesmo anúncio.
 *           example: 1
 */

/**
 * @swagger
 * /anuncio-midias:
 *   post:
 *     summary: Criar uma mídia de anúncio
 *     tags: [Anúncio Mídias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAnuncioMidia'
 *     responses:
 *       201:
 *         description: Mídia criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Anúncio não encontrado (anúncios removidos também retornam este erro)
 *       409:
 *         description: Já existe uma mídia com essa ordem neste anúncio
 */
router.post('/anuncio-midias', AnuncioMidiasController.createAnuncioMidias);

/**
 * @swagger
 * /anuncio-midias:
 *   get:
 *     summary: Listar todas as mídias dos anúncios
 *     tags: [Anúncio Mídias]
 *     parameters:
 *       - in: query
 *         name: anuncioId
 *         required: false
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: Filtrar pelas mídias de um anúncio
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
 *         description: Lista de mídias dos anúncios
 *       400:
 *         description: Parâmetros de consulta inválidos
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
 *           format: int64
 *           minimum: 1
 *         description: ID da mídia
 *     responses:
 *       200:
 *         description: Mídia encontrada
 *       400:
 *         description: ID inválido
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
 *           format: int64
 *           minimum: 1
 *         description: ID da mídia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAnuncioMidia'
 *     responses:
 *       200:
 *         description: Mídia atualizada com sucesso
 *       400:
 *         description: Dados inválidos (inclui nenhum campo informado)
 *       404:
 *         description: Mídia não encontrada
 *       409:
 *         description: Já existe uma mídia com essa ordem neste anúncio
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
 *           format: int64
 *           minimum: 1
 *         description: ID da mídia
 *     responses:
 *       204:
 *         description: Mídia excluída com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Mídia não encontrada
 */
router.delete('/anuncio-midias/:id', AnuncioMidiasController.deleteAnuncioMidias);

export default router;