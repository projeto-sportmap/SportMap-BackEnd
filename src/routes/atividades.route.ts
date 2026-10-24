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
 * components:
 *   schemas:
 *     CreateAtividade:
 *       type: object
 *       required:
 *         - usuarioId
 *         - esporteId
 *         - latitude
 *         - longitude
 *         - expiraEm
 *       properties:
 *         usuarioId:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           description: ID do usuário que cria a atividade (também aceita número em formato de texto, ex. "1").
 *           example: 1
 *         esporteId:
 *           type: integer
 *           minimum: 1
 *           maximum: 2147483647
 *           example: 1
 *         descricao:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: Pelada de futebol no fim da tarde
 *         latitude:
 *           type: number
 *           format: double
 *           minimum: -90
 *           maximum: 90
 *           description: Até 6 casas decimais.
 *           example: -22.9235
 *         longitude:
 *           type: number
 *           format: double
 *           minimum: -180
 *           maximum: 180
 *           description: Até 6 casas decimais.
 *           example: -45.4613
 *         expiraEm:
 *           type: string
 *           format: date-time
 *           description: Data e hora de expiração. Deve ser uma data futura.
 *           example: "2030-12-31T23:59:00Z"
 *     UpdateAtividade:
 *       type: object
 *       description: Todos os campos são opcionais, mas é preciso informar pelo menos um.
 *       minProperties: 1
 *       properties:
 *         descricao:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: Descrição atualizada
 *         status:
 *           type: string
 *           enum: [aberta, em_andamento, concluida, cancelada, expirada]
 *           example: em_andamento
 *         expiraEm:
 *           type: string
 *           format: date-time
 *           description: Deve ser uma data futura.
 *           example: "2030-12-31T23:59:00Z"
 */

/**
 * @swagger
 * /atividades:
 *   post:
 *     summary: Criar uma atividade
 *     tags: [Atividades]
 *     description: A atividade é criada com o status "aberta".
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAtividade'
 *     responses:
 *       201:
 *         description: Atividade criada com sucesso
 *       400:
 *         description: Dados inválidos (inclui data de expiração que não seja futura)
 *       404:
 *         description: Usuário ou esporte não encontrado
 */
router.post('/atividades', AtividadesController.createAtividades);

/**
 * @swagger
 * /atividades:
 *   get:
 *     summary: Listar todas as atividades
 *     tags: [Atividades]
 *     description: Se o status não for informado, retorna apenas as atividades com status "aberta".
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [aberta, em_andamento, concluida, cancelada, expirada]
 *           default: aberta
 *         description: Filtrar pelo status da atividade
 *       - in: query
 *         name: esporteId
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filtrar pelo ID do esporte
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
 *         description: Lista de atividades retornada com sucesso
 *       400:
 *         description: Parâmetros de consulta inválidos
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
 *           format: int64
 *           minimum: 1
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: Atividade encontrada
 *       400:
 *         description: ID inválido
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
 *     description: Permite alterar somente descrição, status e data de expiração.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID da atividade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAtividade'
 *     responses:
 *       200:
 *         description: Atividade atualizada com sucesso
 *       400:
 *         description: Dados inválidos (inclui nenhum campo informado e data de expiração que não seja futura)
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
 *     description: Cancelamento lógico. Muda o status para "cancelada" e preserva o histórico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: Atividade cancelada com sucesso
 *       400:
 *         description: ID inválido
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
 *     description: Exclusão física (definitiva). Para manter o histórico, use o cancelamento.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         description: ID da atividade
 *     responses:
 *       204:
 *         description: Atividade excluída com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Atividade não encontrada
 */
router.delete('/atividades/:id', AtividadesController.deleteAtividades);

export default router;