import { Router } from 'express';
import * as EsportesController from '../controllers/esportes.controller.js';

const router = Router();
router.post('/esportes', EsportesController.createEsporte);
router.get('/esportes', EsportesController.getAllEsportes);
router.get('/esportes/:id', EsportesController.getEsportesById);
router.put('/esportes/:id', EsportesController.updateEsportes);
router.delete('/esportes/:id', EsportesController.deleteEsportes);
export default router;