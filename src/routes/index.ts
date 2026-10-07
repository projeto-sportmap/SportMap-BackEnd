import { Router } from 'express';
import esportesRoutes from './esportes.route.js';
import seguidoresRoutes from './seguidores.route.js';
import usuariosRoutes from './usuarios.route.js';
import conversasRoutes from './conversas.route.js';
import publicacoesRoutes from './publicacoes.route.js';


const routes = Router();
routes.use(esportesRoutes);
routes.use(seguidoresRoutes);
routes.use(usuariosRoutes);
routes.use(conversasRoutes);
routes.use(publicacoesRoutes);
export default routes;