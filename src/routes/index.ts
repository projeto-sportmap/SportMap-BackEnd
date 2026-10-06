import { Router } from 'express';
import esportesRoutes from './esportes.route.js';
import usuariosRoutes from './usuarios.route.js';

const routes = Router();
routes.use(esportesRoutes);
routes.use(usuariosRoutes);
export default routes;