import type { Response } from 'express';

export type ActivityNotification = {
  id: string;
  createdAt: string;
  type: 'follow' | 'like' | 'comment';
  actorName: string;
  actorUsername?: string;
  resourceId?: string;
  text?: string;
};

const clients = new Map<string, Set<Response>>();
let nextId = 0;

export function subscribeToNotifications(userId: string, response: Response) {
  const listeners = clients.get(userId) ?? new Set<Response>();
  listeners.add(response);
  clients.set(userId, listeners);

  return () => {
    listeners.delete(response);
    if (listeners.size === 0) clients.delete(userId);
  };
}

export function publishNotification(
  userId: string,
  notification: Omit<ActivityNotification, 'id' | 'createdAt'> & { createdAt?: string },
  eventId?: string,
) {
  const listeners = clients.get(userId);
  if (!listeners) return;

  const event: ActivityNotification = {
    ...notification,
    id: eventId ?? `${Date.now()}-${++nextId}`,
    createdAt: notification.createdAt ?? new Date().toISOString(),
  };
  const message = `data: ${JSON.stringify(event)}\n\n`;
  for (const response of listeners) {
    if (response.destroyed || response.writableEnded) {
      listeners.delete(response);
      continue;
    }
    try {
      response.write(message);
    } catch {
      listeners.delete(response);
    }
  }
  if (listeners.size === 0) clients.delete(userId);
}
