import { Router } from 'express';
import * as ConversasController from '../controllers/conversas.controller.js';

const router = Router();
router.post('/conversas', ConversasController.createConversas);
router.get('/conversas', ConversasController.getAllConversas);
router.get('/conversas/:id', ConversasController.getConversasById);
router.delete('/conversas/:id', ConversasController.deleteConversas);
export default router;