import { Router } from 'express';
import * as AvaliacoesController from '../controllers/avaliacoes.controller.js';

const router = Router();
router.post('/avaliacoes', AvaliacoesController.createAvaliacoes);
router.get('/avaliacoes', AvaliacoesController.getAllAvaliacoes);
router.get('/avaliacoes/media/:anuncioId', AvaliacoesController.getMediaPorAnuncio);
router.get('/avaliacoes/:id', AvaliacoesController.getAvaliacoesById);
router.put('/avaliacoes/:id', AvaliacoesController.updateAvaliacoes);
router.delete('/avaliacoes/:id', AvaliacoesController.deleteAvaliacoes);
export default router;