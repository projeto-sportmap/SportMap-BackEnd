import { Router } from 'express';
import { db } from '../prisma/db.js';
// AJUSTA só o nome do arquivo: é o arquivo que você me mandou (veja no explorer do VS Code)
import { getAllPublicacoes, toPublicPublicacao } from '../services/publicacoes.service.js';

const router = Router();

router.get('/feed', async (_req, res, next) => {
  try {
    const [publicacoes, eventos, esportes] = await Promise.all([
      getAllPublicacoes(),
      db.orm.public.Eventos.all(),
      db.orm.public.Esportes.all(),
    ]);

    const nomeEsporte = new Map(esportes.map((e: any) => [String(e.id), e.nome]));
    const agora = Date.now();

    const itensPublicacao = publicacoes.map((p) => ({
      ...toPublicPublicacao(p),
      tipo: 'publicacao' as const,
    }));

    const itensEvento = eventos
      .filter((e: any) => e.status === 'aberta' && Date.parse(String(e.expiraEm)) > agora)
      .map((e: any) => ({
        id: String(e.id),
        tipo: 'evento' as const,
        usuarioId: String(e.usuarioId),
        esporteId: e.esporteId,
        esporteNome: nomeEsporte.get(String(e.esporteId)) ?? null,
        descricao: e.descricao,
        latitude: Number(e.latitude),
        longitude: Number(e.longitude),
        createdAt: e.createdAt,
        expiraEm: String(e.expiraEm),
      }));

    const feed = [...itensPublicacao, ...itensEvento];

    // embaralha (Fisher-Yates)
    for (let i = feed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [feed[i], feed[j]] = [feed[j], feed[i]];
    }

    res.json(feed.slice(0, 20));
  } catch (err) {
    next(err);
  }
});

export default router;