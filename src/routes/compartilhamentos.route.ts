import { Router } from 'express';
import * as CompartilhamentosController from '../controllers/compartilhamentos.controller.js';

const router = Router();
router.post('/compartilhamentos', CompartilhamentosController.createCompartilhamentos);
router.get('/compartilhamentos', CompartilhamentosController.getAllCompartilhamentos);
router.get('/compartilhamentos/:id', CompartilhamentosController.getCompartilhamentosById);
router.delete('/compartilhamentos/:id', CompartilhamentosController.deleteCompartilhamentos);
export default router;