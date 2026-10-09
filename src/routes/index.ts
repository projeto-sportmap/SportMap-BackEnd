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
import atividadesRoutes from './atividades.route.js';
import mensagensRoutes from './mensagens.route.js';
import conversa_participantesRoutes from './conversa_participantes.route.js';
import anuncio_favoritosRoutes from './anuncio_favoritos.route.js';
import anuncio_midiasRoutes from './anuncio_midias.route.js';
import anunciosRoutes from './anuncios.route.js';
import avaliacoesRoutes from './avaliacoes.route.js';
import compartilhamentosRoutes from './compartilhamentos.route.js';


import authRoutes from './auth.route.js';
 
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
routes.use(atividadesRoutes);
routes.use(mensagensRoutes);
routes.use(conversa_participantesRoutes);
routes.use(anuncio_favoritosRoutes);
routes.use(anuncio_midiasRoutes);
routes.use(anunciosRoutes);
routes.use(avaliacoesRoutes);
routes.use(compartilhamentosRoutes);

/*
 * Autenticação
 *
 * POST /login
 * POST /logout
 */
routes.use(authRoutes);
 
export default routes;