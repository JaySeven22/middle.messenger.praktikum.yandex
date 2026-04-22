import type { ChatsData } from '../../entities/Chat';

/**
 * Нормализует ответ `GET /chats` к виду `ChatsData[]`.
 */
export function parseChatsResponse(data: unknown): ChatsData[] {
  if (Array.isArray(data)) {
    return data as ChatsData[];
  }
  if (data !== null && typeof data === 'object' && 'response' in data) {
    const { response } = data as { response: unknown };
    if (Array.isArray(response)) {
      return response as ChatsData[];
    }
  }
  return [];
}
