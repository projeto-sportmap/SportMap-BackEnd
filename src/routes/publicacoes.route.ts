import { Router } from 'express';
import * as PublicacoesController from '../controllers/publicacoes.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createPublicacaoSchema,
  updatePublicacaoSchema,
  publicacaoIdSchema,
  listPublicacoesSchema,
} from '../schemas/publicacoes.schema.js';

const router = Router();
router.post('/publicacoes', validate(createPublicacaoSchema), PublicacoesController.createPublicacao);
router.get('/publicacoes', validate(listPublicacoesSchema), PublicacoesController.getAllPublicacoes);
router.get('/publicacoes/:id', validate(publicacaoIdSchema), PublicacoesController.getPublicacaoById);
router.put('/publicacoes/:id', validate(updatePublicacaoSchema), PublicacoesController.updatePublicacao);
router.delete('/publicacoes/:id', validate(publicacaoIdSchema), PublicacoesController.deletePublicacao);
export default router;