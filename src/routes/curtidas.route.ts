import { Router } from 'express';
import * as CurtidasController from '../controllers/curtidas.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import {
  createCurtidaSchema,
  curtidaIdSchema,
  listCurtidasSchema,
} from '../schemas/curtidas.schema.js';

const router = Router();
router.post('/curtidas', validate(createCurtidaSchema), CurtidasController.createCurtida);
router.get('/curtidas', validate(listCurtidasSchema), CurtidasController.getAllCurtidas);
router.get('/curtidas/:id', validate(curtidaIdSchema), CurtidasController.getCurtidaById);
router.delete('/curtidas/:id', validate(curtidaIdSchema), CurtidasController.deleteCurtida);
export default router;