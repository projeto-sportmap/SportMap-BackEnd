import { Router } from 'express';
import esportesRoutes from './esportes.route.js';
import seguidoresRoutes from './seguidores.route.js';

const routes = Router();
routes.use(esportesRoutes);
routes.use(seguidoresRoutes);
export default routes;