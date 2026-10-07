import { Router } from 'express';
import esportesRoutes from './esportes.route.js';
import comentariosRoutes from './comentarios.routes.js';

const routes = Router();
routes.use(esportesRoutes);
routes.use(comentariosRoutes);
export default routes;