
import { Router } from 'express';
import * as AvaliacoesController from '../controllers/avaliacoes.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Avaliações
 *   description: Gerenciamento das avaliações dos anúncios
 */

/**
 * @swagger
 * /avaliacoes:
 *   post:
 *     summary: Criar uma avaliação
 *     tags: [Avaliações]
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/avaliacoes', AvaliacoesController.createAvaliacoes);

/**
 * @swagger
 * /avaliacoes:
 *   get:
 *     summary: Listar todas as avaliações
 *     tags: [Avaliações]
 *     responses:
 *       200:
 *         description: Lista de avaliações
 */
router.get('/avaliacoes', AvaliacoesController.getAllAvaliacoes);

/**
 * @swagger
 * /avaliacoes/media/{anuncioId}:
 *   get:
 *     summary: Calcular a média das avaliações de um anúncio
 *     tags: [Avaliações]
 *     parameters:
 *       - in: path
 *         name: anuncioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do anúncio
 *     responses:
 *       200:
 *         description: Média das avaliações calculada com sucesso
 *       404:
 *         description: Anúncio não encontrado ou sem avaliações
 */
router.get('/avaliacoes/media/:anuncioId', AvaliacoesController.getMediaPorAnuncio);

/**
 * @swagger
 * /avaliacoes/{id}:
 *   get:
 *     summary: Buscar avaliação por ID
 *     tags: [Avaliações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da avaliação
 *     responses:
 *       200:
 *         description: Avaliação encontrada
 *       404:
 *         description: Avaliação não encontrada
 */
router.get('/avaliacoes/:id', AvaliacoesController.getAvaliacoesById);

/**
 * @swagger
 * /avaliacoes/{id}:
 *   put:
 *     summary: Atualizar uma avaliação
 *     tags: [Avaliações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da avaliação
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Avaliação não encontrada
 */
router.put('/avaliacoes/:id', AvaliacoesController.updateAvaliacoes);

/**
 * @swagger
 * /avaliacoes/{id}:
 *   delete:
 *     summary: Excluir uma avaliação
 *     tags: [Avaliações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da avaliação
 *     responses:
 *       200:
 *         description: Avaliação excluída com sucesso
 *       404:
 *         description: Avaliação não encontrada
 */
router.delete('/avaliacoes/:id', AvaliacoesController.deleteAvaliacoes);

export default router;
