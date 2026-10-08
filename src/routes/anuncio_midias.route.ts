import { Router } from 'express';
import * as AnuncioMidiasController from '../controllers/anuncio_midias.controller.js';

const router = Router();
router.post('/anuncio-midias', AnuncioMidiasController.createAnuncioMidias);
router.get('/anuncio-midias', AnuncioMidiasController.getAllAnuncioMidias);
router.get('/anuncio-midias/:id', AnuncioMidiasController.getAnuncioMidiasById);
router.put('/anuncio-midias/:id', AnuncioMidiasController.updateAnuncioMidias);
router.delete('/anuncio-midias/:id', AnuncioMidiasController.deleteAnuncioMidias);
export default router;