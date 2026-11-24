import { Router } from 'express';
import { getRecentNotifications, streamNotifications } from '../controllers/notifications.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/notificacoes/recentes', authMiddleware, getRecentNotifications);
router.get('/notificacoes/stream', authMiddleware, streamNotifications);

export default router;
