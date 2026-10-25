import { Router } from 'express';
import * as AnunciosController from '../controllers/anuncios.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Anúncios
 *   description: Gerenciamento dos anúncios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAnuncio:
 *       type: object
 *       required:
 *         - titulo
 *         - preco
 *         - condicao
 *       properties:
 *         titulo:
 *           type: string
 *           minLength: 1
 *           maxLength: 150
 *           example: Bola de futebol de campo
 *         descricao:
 *           type: string
 *           nullable: true
 *           example: Bola em ótimo estado, usada poucas vezes.
 *         preco:
 *           type: number
 *           minimum: 0
 *           description: Até 8 dígitos inteiros e 2 casas decimais.
 *           example: 89.9
 *         esporteId:
 *           type: integer
 *           minimum: 1
 *           maximum: 2147483647
 *           nullable: true
 *           example: 1
 *         condicao:
 *           type: string
 *           enum: [novo, seminovo, usado]
 *           example: seminovo
 *         latitude:
 *           type: number
 *           format: double
 *           minimum: -90
 *           maximum: 90
 *           nullable: true
 *           description: Até 6 casas decimais. Deve ser enviada junto com longitude.
 *           example: -22.9235
 *         longitude:
 *           type: number
 *           format: double
 *           minimum: -180
 *           maximum: 180
 *           nullable: true
 *           description: Até 6 casas decimais. Deve ser enviada junto com latitude.
 *           example: -45.4613
 *         cidade:
 *           type: string
 *           maxLength: 100
 *           nullable: true
 *           example: Pindamonhangaba
 *     UpdateAnuncio:
 *       type: object
 *       description: Todos os campos são opcionais, mas é preciso informar pelo menos um. Latitude e longitude devem ser enviadas juntas.
 *       minProperties: 1
 *       properties:
 *         titulo:
 *           type: string
 *           minLength: 1
 *           maxLength: 150
 *           example: Bola de futebol de campo oficial
 *         descricao:
 *           type: string
 *           nullable: true
 *           example: Descrição atualizada.
 *         preco:
 *           type: number
 *           minimum: 0
 *           description: Até 8 dígitos inteiros e 2 casas decimais.
 *           example: 79.9
 *         esporteId:
 *           type: integer
 *           minimum: 1
 *           maximum: 2147483647
 *           nullable: true
 *           example: 1
 *         condicao:
 *           type: string
 *           enum: [novo, seminovo, usado]
 *           example: usado
 *         status:
 *           type: string
 *           enum: [ativo, pausado, vendido, removido]
 *           example: pausado
 *         latitude:
 *           type: number
 *           format: double
 *           minimum: -90
 *           maximum: 90
 *           nullable: true
 *           example: -22.9235
 *         longitude:
 *           type: number
 *           format: double
 *           minimum: -180
 *           maximum: 180
 *           nullable: true
 *           example: -45.4613
 *         cidade:
 *           type: string
 *           maxLength: 100
 *           nullable: true
 *           example: Pindamonhangaba
 */

/**
 * @swagger
 * /anuncios:
 *   post:
 *     summary: Criar um anúncio
 *     tags: [Anúncios]
 *     description: O dono do anúncio é o usuário autenticado. O anúncio é criado com o status "ativo".
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAnuncio'
 *     responses:
 *       201:
 *         description: Anúncio criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Usuário ou esporte não encontrado
 */
router.post('/anuncios', authMiddleware, AnunciosController.createAnuncios);

/**
 * @swagger
 * /anuncios:
 *   get:
 *     summary: Listar todos os anúncios
 *     tags: [Anúncios]
 *     description: Se o status não for informado, retorna apenas os anúncios com status "ativo".
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ativo, pausado, vendido, removido]
 *           default: ativo
 *         description: Filtrar pelo status do anúncio
 *       - in: query
 *         name: esporteId
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filtrar pelo ID do esporte
 *       - in: query
 *         name: cidade
 *         required: false
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Filtrar pela cidade (texto exato)
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
 *         description: Lista de anúncios
 *       400:
 *         description: Parâmetros de consulta inválidos
 */
router.get('/anuncios', AnunciosController.getAllAnuncios);

/**
 * @swagger
 * /anuncios/{id}:
 *   get:
 *     summary: Buscar anúncio por ID
 *     tags: [Anúncios]
 *     description: Anúncios removidos retornam 404.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID do anúncio
 *     responses:
 *       200:
 *         description: Anúncio encontrado
 *       400:
 *         description: ID inválido
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
 *     description: Somente o dono do anúncio pode alterá-lo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID do anúncio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAnuncio'
 *     responses:
 *       200:
 *         description: Anúncio atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Você não tem permissão para alterar este anúncio (não é o dono)
 *       404:
 *         description: Anúncio ou esporte não encontrado
 */
router.put('/anuncios/:id', authMiddleware, AnunciosController.updateAnuncios);

/**
 * @swagger
 * /anuncios/{id}:
 *   delete:
 *     summary: Remover um anúncio
 *     tags: [Anúncios]
 *     description: Exclusão lógica (o status vira "removido"), que preserva favoritos, mídias e avaliações. Somente o dono pode remover.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID do anúncio
 *     responses:
 *       204:
 *         description: Anúncio removido com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Você não tem permissão para alterar este anúncio (não é o dono)
 *       404:
 *         description: Anúncio não encontrado
 */
router.delete('/anuncios/:id', authMiddleware, AnunciosController.removerAnuncios);

export default router;