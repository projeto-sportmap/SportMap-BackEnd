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
 * components:
 *   schemas:
 *     CreateAvaliacao:
 *       type: object
 *       required:
 *         - avaliadorId
 *         - anuncioId
 *         - nota
 *       properties:
 *         avaliadorId:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           description: ID do usuário que avalia (também aceita número em formato de texto, ex. "1"). Não pode ser o dono do anúncio.
 *           example: 1
 *         anuncioId:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           description: ID do anúncio avaliado (também aceita número em formato de texto).
 *           example: 1
 *         nota:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comentario:
 *           type: string
 *           maxLength: 1000
 *           nullable: true
 *           example: Ótimo vendedor, produto conforme o anunciado.
 *     UpdateAvaliacao:
 *       type: object
 *       description: Todos os campos são opcionais, mas é preciso informar pelo menos um.
 *       minProperties: 1
 *       properties:
 *         nota:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         comentario:
 *           type: string
 *           maxLength: 1000
 *           nullable: true
 *           example: Comentário atualizado.
 */

/**
 * @swagger
 * /avaliacoes:
 *   post:
 *     summary: Criar uma avaliação
 *     tags: [Avaliações]
 *     description: Cada usuário só pode avaliar o mesmo anúncio uma vez, e não pode avaliar o próprio anúncio.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAvaliacao'
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *       400:
 *         description: Dados inválidos (inclui avaliar o próprio anúncio)
 *       404:
 *         description: Usuário avaliador ou anúncio não encontrado
 *       409:
 *         description: Você já avaliou este anúncio
 */
router.post('/avaliacoes', AvaliacoesController.createAvaliacoes);

/**
 * @swagger
 * /avaliacoes:
 *   get:
 *     summary: Listar todas as avaliações
 *     tags: [Avaliações]
 *     parameters:
 *       - in: query
 *         name: anuncioId
 *         required: false
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: Filtrar pelas avaliações de um anúncio
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
 *         description: Lista de avaliações
 *       400:
 *         description: Parâmetros de consulta inválidos
 */
router.get('/avaliacoes', AvaliacoesController.getAllAvaliacoes);

/**
 * @swagger
 * /avaliacoes/media/{anuncioId}:
 *   get:
 *     summary: Calcular a média das avaliações de um anúncio
 *     tags: [Avaliações]
 *     description: Retorna anuncioId, media (com 2 casas decimais) e total de avaliações. Se o anúncio ainda não tiver avaliações, a media vem como null e o total como 0.
 *     parameters:
 *       - in: path
 *         name: anuncioId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID do anúncio
 *     responses:
 *       200:
 *         description: Média das avaliações calculada com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Anúncio não encontrado
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
 *           format: int64
 *           minimum: 1
 *         description: ID da avaliação
 *     responses:
 *       200:
 *         description: Avaliação encontrada
 *       400:
 *         description: ID inválido
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
 *     description: Permite alterar somente a nota e o comentário.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID da avaliação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAvaliacao'
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso
 *       400:
 *         description: Dados inválidos (inclui nenhum campo informado)
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
 *           format: int64
 *           minimum: 1
 *         description: ID da avaliação
 *     responses:
 *       204:
 *         description: Avaliação excluída com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Avaliação não encontrada
 */
router.delete('/avaliacoes/:id', AvaliacoesController.deleteAvaliacoes);

export default router;