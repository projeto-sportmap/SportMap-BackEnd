import { Router } from 'express';
import * as SeguidoresController from '../controllers/seguidores.controller.js';

const router = Router();
router.post('/seguidores', SeguidoresController.createSeguidores);
router.get('/seguidores', SeguidoresController.getAllSeguidores);
router.get('/seguidores/:seguidorId/:seguidoId', SeguidoresController.getSeguidor);
router.delete('/seguidores/:seguidorId/:seguidoId', SeguidoresController.deleteSeguidores);
export default router;