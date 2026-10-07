import { Router } from 'express';
import * as AtividadesController from '../controllers/atividades.controller.js';

const router = Router();
router.post('/atividades', AtividadesController.createAtividades);
router.get('/atividades', AtividadesController.getAllAtividades);
router.get('/atividades/:id', AtividadesController.getAtividadesById);
router.put('/atividades/:id', AtividadesController.updateAtividades);
router.patch('/atividades/:id/cancelar', AtividadesController.cancelarAtividades);
router.delete('/atividades/:id', AtividadesController.deleteAtividades);
export default router;