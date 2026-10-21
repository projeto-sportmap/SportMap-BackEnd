import { Router } from 'express';
import * as UsuariosController from '../controllers/usuarios.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { uploadFoto } from '../middlewares/upload.js';

import {
  createUsuarioSchema,
  updateUsuarioSchema,
  usuarioIdSchema,
  localizacaoSchema,
} from '../schemas/usuarios.schema.js';

import {
  authMiddleware,
  requireSelf,
} from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Cadastro e gerenciamento de contas de usuários
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     CreateUsuario:
 *       type: object
 *       required:
 *         - nome
 *         - sobrenome
 *         - username
 *         - email
 *         - senha
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Brayan"
 *         sobrenome:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Rodrigues"
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           pattern: '^[a-z0-9_.]+$'
 *           description: Apenas letras, números, "_" e "." (convertido para minúsculas).
 *           example: "brayan.rodrigues"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           example: "brayan@email.com"
 *         senha:
 *           type: string
 *           format: password
 *           minLength: 6
 *           maxLength: 72
 *           example: "Senha123!"
 *         fotoPerfilUrl:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: "https://exemplo.com/foto.jpg"
 *         cidade:
 *           type: string
 *           maxLength: 100
 *           nullable: true
 *           example: "Pindamonhangaba"
 *         bio:
 *           type: string
 *           maxLength: 1000
 *           nullable: true
 *           example: "Desenvolvedor backend."
 *         latitude:
 *           type: number
 *           format: double
 *           minimum: -90
 *           maximum: 90
 *           nullable: true
 *           description: Deve ser enviada junto com longitude.
 *           example: -22.9235
 *         longitude:
 *           type: number
 *           format: double
 *           minimum: -180
 *           maximum: 180
 *           nullable: true
 *           description: Deve ser enviada junto com latitude.
 *           example: -45.4613
 *     UpdateUsuario:
 *       type: object
 *       description: Todos os campos são opcionais, mas é preciso informar pelo menos um. Latitude e longitude devem ser enviadas juntas.
 *       minProperties: 1
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Brayan"
 *         sobrenome:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Rodrigues"
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           pattern: '^[a-z0-9_.]+$'
 *           example: "brayan.rodrigues"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           example: "brayan@email.com"
 *         senha:
 *           type: string
 *           format: password
 *           minLength: 6
 *           maxLength: 72
 *           example: "NovaSenha123!"
 *         fotoPerfilUrl:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: "https://exemplo.com/foto.jpg"
 *         cidade:
 *           type: string
 *           maxLength: 100
 *           nullable: true
 *           example: "Pindamonhangaba"
 *         bio:
 *           type: string
 *           maxLength: 1000
 *           nullable: true
 *           example: "Desenvolvedor backend."
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
 *     Localizacao:
 *       type: object
 *       required:
 *         - latitude
 *         - longitude
 *       properties:
 *         latitude:
 *           type: number
 *           format: double
 *           minimum: -90
 *           maximum: 90
 *           example: -22.9235
 *         longitude:
 *           type: number
 *           format: double
 *           minimum: -180
 *           maximum: 180
 *           example: -45.4613
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastrar um novo usuário
 *     tags: [Usuários]
 *     description: Rota pública para cadastro de usuários.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUsuario'
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Usuário já cadastrado
 */
router.post(
  '/usuarios',
  validate(createUsuarioSchema),
  UsuariosController.createUsuario,
);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar usuários
 *     tags: [Usuários]
 *     description: Requer autenticação. Retorna somente o próprio usuário.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso não autorizado
 */
router.get(
  '/usuarios',
  authMiddleware,
  UsuariosController.getAllUsuarios,
);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Consultar usuário por ID
 *     tags: [Usuários]
 *     description: Permite consultar somente a própria conta.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não é permitido consultar a conta de outro usuário
 *       404:
 *         description: Usuário não encontrado
 */
router.get(
  '/usuarios/:id',
  authMiddleware,
  validate(usuarioIdSchema),
  requireSelf,
  UsuariosController.getUsuarioById,
);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualizar dados do usuário
 *     tags: [Usuários]
 *     description: Permite alterar somente os dados da própria conta.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUsuario'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não é permitido alterar a conta de outro usuário
 *       404:
 *         description: Usuário não encontrado
 */
router.put(
  '/usuarios/:id',
  authMiddleware,
  validate(updateUsuarioSchema),
  requireSelf,
  UsuariosController.updateUsuario,
);

/**
 * @swagger
 * /usuarios/{id}/localizacao:
 *   patch:
 *     summary: Atualizar localização do usuário
 *     tags: [Usuários]
 *     description: Permite atualizar somente a própria localização.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Localizacao'
 *     responses:
 *       200:
 *         description: Localização atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não é permitido alterar a localização de outro usuário
 *       404:
 *         description: Usuário não encontrado
 */
router.patch(
  '/usuarios/:id/localizacao',
  authMiddleware,
  validate(localizacaoSchema),
  requireSelf,
  UsuariosController.updateLocalizacao,
);

/**
 * @swagger
 * /usuarios/{id}/foto:
 *   patch:
 *     summary: Atualizar foto do usuário
 *     tags: [Usuários]
 *     description: Permite enviar uma foto para a própria conta (multipart/form-data, campo "foto").
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - foto
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo da foto do usuário
 *     responses:
 *       200:
 *         description: Foto atualizada com sucesso
 *       400:
 *         description: ID ou arquivo inválido
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não é permitido alterar a foto de outro usuário
 *       404:
 *         description: Usuário não encontrado
 */
router.patch(
  '/usuarios/:id/foto',
  authMiddleware,
  validate(usuarioIdSchema),
  requireSelf,
  uploadFoto,
  UsuariosController.updateFoto,
);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Excluir conta do usuário
 *     tags: [Usuários]
 *     description: Permite excluir somente a própria conta.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Conta excluída com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não é permitido excluir a conta de outro usuário
 *       404:
 *         description: Usuário não encontrado
 */
router.delete(
  '/usuarios/:id',
  authMiddleware,
  validate(usuarioIdSchema),
  requireSelf,
  UsuariosController.deleteUsuario,
);

export default router;