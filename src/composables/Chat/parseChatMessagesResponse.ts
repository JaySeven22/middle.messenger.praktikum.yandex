import type { ChatMessageRaw } from '../../entities/Chat';

/**
 * Из произвольного payload (одно сообщение / массив истории / что-то
 * служебное) достаёт нормализованный список ChatMessageRaw.
 *
 * Сервер шлёт два формата с сообщениями чата:
 * - объект,
 * - массив (ответ на `get old` — история).
 * Всё, что не похоже на сообщение (например, `{type: 'user connected'}`),
 * отбрасывается.
 */
export function parseChatMessagesResponse(raw: unknown): ChatMessageRaw[] {
  if (Array.isArray(raw)) {
    return raw.filter(isChatMessage);
  }
  if (isChatMessage(raw)) {
    return [raw];
  }
  return [];
}

function isChatMessage(value: unknown): value is ChatMessageRaw {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== 'number') return false;
  if (typeof v.user_id !== 'number') return false;
  if (typeof v.time !== 'string') return false;
  if (typeof v.content !== 'string') return false;
  if (v.type !== undefined && v.type !== 'message' && v.type !== 'file' && v.type !== 'sticker') {
    return false;
  }
  return true;
}
