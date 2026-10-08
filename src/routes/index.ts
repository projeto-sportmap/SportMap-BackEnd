import { Router } from 'express';
import esportesRoutes from './esportes.route.js';
import comentariosRoutes from './comentarios.routes.js';
import seguidoresRoutes from './seguidores.route.js';
import usuariosRoutes from './usuarios.route.js';
import conversasRoutes from './conversas.route.js';
import publicacoesRoutes from './publicacoes.route.js';
import curtidasRoutes from './curtidas.route.js';
import usuarioEsportesRoutes from './usuario-esportes.route.js';
import publicacaoMidiasRoutes from './publimidia.route.js';

const routes = Router();
routes.use(esportesRoutes);
routes.use(comentariosRoutes);
routes.use(seguidoresRoutes);
routes.use(usuariosRoutes);
routes.use(conversasRoutes);
routes.use(publicacoesRoutes);
routes.use(curtidasRoutes);
routes.use(usuarioEsportesRoutes);
routes.use(publicacaoMidiasRoutes);

export default routes;