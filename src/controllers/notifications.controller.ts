import type { Request, Response } from 'express';
import { db } from '../prisma/db.js';
import { subscribeToNotifications } from '../services/notificationHub.js';

type RecentActivity = {
  id: string;
  type: 'follow' | 'like' | 'comment';
  resourceId?: string;
  actorId: bigint;
  createdAt: Date | string;
  text?: string;
};

export async function getRecentNotifications(req: Request, res: Response) {
  res.set('Cache-Control', 'no-store');
  const userId = BigInt(res.locals.userId);
  const requestedSince = Number(req.query.since);
  const since = Number.isFinite(requestedSince) ? requestedSince : Date.now();

  const [followers, posts, allLikes, allComments] = await Promise.all([
    db.orm.public.Seguidores.all(),
    db.orm.public.Publicacoes.where({ usuarioId: userId }).all(),
    db.orm.public.Curtidas.all(),
    db.orm.public.Comentarios.all(),
  ]);
  const postIds = new Set(posts.map((post) => post.id));
  const recent: RecentActivity[] = [
    ...followers
      .filter((relation) => relation.seguidoId === userId)
      .map((relation) => ({
        id: `follow-${relation.id}`,
        type: 'follow' as const,
        actorId: relation.seguidorId,
        createdAt: relation.createdAt,
      })),
    ...allLikes
      .filter((like) => postIds.has(like.publicacaoId) && like.usuarioId !== userId)
      .map((like) => ({
        id: `like-${like.id}`,
        type: 'like' as const,
        resourceId: String(like.publicacaoId),
        actorId: like.usuarioId,
        createdAt: like.createdAt,
      })),
    ...allComments
      .filter((comment) => postIds.has(comment.publicacaoId) && comment.usuarioId !== userId)
      .map((comment) => ({
        id: `comment-${comment.id}`,
        type: 'comment' as const,
        resourceId: String(comment.publicacaoId),
        actorId: comment.usuarioId,
        createdAt: comment.createdAt,
        text: comment.conteudo.slice(0, 180),
      })),
  ].filter((activity) => Date.parse(String(activity.createdAt)) >= since)
    .sort((a, b) => Date.parse(String(a.createdAt)) - Date.parse(String(b.createdAt)));

  const actorIds = [...new Set(recent.map((activity) => activity.actorId))];
  const actors = await Promise.all(actorIds.map((id) => db.orm.public.Usuarios.first({ id })));
  const actorById = new Map(actors.filter(Boolean).map((actor) => [String(actor!.id), actor!]));

  res.json(recent.flatMap((activity) => {
    const actor = actorById.get(String(activity.actorId));
    if (!actor) return [];
    return [{
      id: activity.id,
      type: activity.type,
      createdAt: new Date(activity.createdAt).toISOString(),
      ...(activity.resourceId ? { resourceId: activity.resourceId } : {}),
      actorName: [actor.nome, actor.sobrenome].filter(Boolean).join(' '),
      actorUsername: actor.username,
      ...(activity.text ? { text: activity.text } : {}),
    }];
  }));
}

export function streamNotifications(_req: Request, res: Response) {
  const userId = String(res.locals.userId);
  res.status(200);
  res.set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();
  res.write(': connected\n\n');

  const unsubscribe = subscribeToNotifications(userId, res);
  const heartbeat = setInterval(() => {
    if (!res.destroyed && !res.writableEnded) res.write(': ping\n\n');
  }, 20_000);
  res.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
}
