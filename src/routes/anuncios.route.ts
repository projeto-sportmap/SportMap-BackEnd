import { Router } from 'express';
import * as AnunciosController from '../controllers/anuncios.controller.js';
import { authenticate } from '../middlewares/authenticate.middlewares.js';

const router = Router();
router.post('/anuncios', authenticate, AnunciosController.createAnuncios);
router.get('/anuncios', AnunciosController.getAllAnuncios);
router.get('/anuncios/:id', AnunciosController.getAnunciosById);
router.put('/anuncios/:id', authenticate, AnunciosController.updateAnuncios);
router.delete('/anuncios/:id', authenticate, AnunciosController.removerAnuncios);
export default router;