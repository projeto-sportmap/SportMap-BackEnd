import { Router } from 'express';
import * as MidiasController from '../controllers/publimidia.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import {
  createPublicacaoMidiaSchema,
  updatePublicacaoMidiaSchema,
  publicacaoMidiaIdSchema,
  listPublicacaoMidiasSchema,
} from '../schemas/publimidia.schema.js';

const router = Router();
router.post('/publicacao-midias', validate(createPublicacaoMidiaSchema), MidiasController.createPublicacaoMidia);
router.get('/publicacao-midias', validate(listPublicacaoMidiasSchema), MidiasController.getAllPublicacaoMidias);
router.get('/publicacao-midias/:id', validate(publicacaoMidiaIdSchema), MidiasController.getPublicacaoMidiaById);
router.put('/publicacao-midias/:id', validate(updatePublicacaoMidiaSchema), MidiasController.updatePublicacaoMidia);
router.delete('/publicacao-midias/:id', validate(publicacaoMidiaIdSchema), MidiasController.deletePublicacaoMidia);
export default router;