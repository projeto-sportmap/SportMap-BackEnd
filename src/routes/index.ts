import { Router } from 'express';
import esportesRoutes from './esportes.route.js';

import comentariosRoutes from './comentarios.routes.js';
import seguidoresRoutes from './seguidores.route.js';
import usuariosRoutes from './usuarios.route.js';
import conversasRoutes from './conversas.route.js';

const routes = Router();
routes.use(esportesRoutes);
routes.use(comentariosRoutes);
routes.use(seguidoresRoutes);
routes.use(usuariosRoutes);
routes.use(conversasRoutes);

 
export default routes;