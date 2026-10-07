import { Router } from 'express';
import * as MensagensController from '../controllers/mensagens.controller.js';

const router = Router();
router.post('/mensagens', MensagensController.createMensagens);
router.get('/mensagens', MensagensController.getAllMensagens);
router.get('/mensagens/:id', MensagensController.getMensagensById);
router.patch('/mensagens/:id/lida', MensagensController.marcarComoLida);
router.delete('/mensagens/:id', MensagensController.deleteMensagens);
export default router;