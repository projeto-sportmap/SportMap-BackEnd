import { Router } from 'express';
import esportesRoutes from './esportes.route.js';
import seguidoresRoutes from './seguidores.route.js';
import usuariosRoutes from './usuarios.route.js';
import conversasRoutes from './conversas.route.js';
import publicacoesRoutes from './publicacoes.route.js';

const rotas = Router();
rotas.use(esportesRoutes);     
rotas.use(seguidoresRoutes);
rotas.use(usuariosRoutes);
rotas.use(conversasRoutes);
rotas.use(publicacoesRoutes);

export default rotas;