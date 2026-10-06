import { Router } from 'express';
import esportesRoutes from './esportes.route.js';
import seguidoresRoutes from './seguidores.route.js';
import conversasRoutes from './conversas.route.js';

const routes = Router();
routes.use(esportesRoutes);
routes.use(seguidoresRoutes);
routes.use(conversasRoutes);
export default routes;