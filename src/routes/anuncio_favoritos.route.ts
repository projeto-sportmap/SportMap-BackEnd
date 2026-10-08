import { Router } from 'express';
import * as AnuncioFavoritosController from '../controllers/anuncio_favoritos.controller.js';

const router = Router();
router.post('/anuncio-favoritos', AnuncioFavoritosController.createAnuncioFavoritos);
router.get('/anuncio-favoritos', AnuncioFavoritosController.getAllAnuncioFavoritos);
router.get('/anuncio-favoritos/:id', AnuncioFavoritosController.getAnuncioFavoritosById);
router.delete('/anuncio-favoritos/:id', AnuncioFavoritosController.deleteAnuncioFavoritos);
export default router;