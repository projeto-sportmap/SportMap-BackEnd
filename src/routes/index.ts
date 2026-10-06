import { Router } from 'express';
import esportesRoutes from './esportes.route.js';

const routes = Router();
routes.use(esportesRoutes);
export default routes;