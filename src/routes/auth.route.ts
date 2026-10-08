import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { loginSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post(
  '/login',
  validate(loginSchema),
  AuthController.login,
);

router.post(
  '/logout',
  AuthController.logout,
);

export default router;