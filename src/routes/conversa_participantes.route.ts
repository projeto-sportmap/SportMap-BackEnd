import { Router } from 'express';
import * as ConversaParticipantesController from '../controllers/conversa_participantes.controller.js';

// Colocar middleware
const router = Router();
router.post('/conversa-participantes', ConversaParticipantesController.createConversaParticipantes);
router.get('/conversa-participantes', ConversaParticipantesController.getAllConversaParticipantes);
router.get('/conversa-participantes/:id', ConversaParticipantesController.getConversaParticipantesById);
router.delete('/conversa-participantes/:id', ConversaParticipantesController.deleteConversaParticipantes);
export default router;