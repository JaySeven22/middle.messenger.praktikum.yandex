import type { UserData } from '../../entities/User';

/**
 * Нормализует ответ `GET /chats/{id}/users` к виду `UserData[]` —
 * список участников конкретного чата.
 *
 * Так же как и у parseChatsResponse/parseUserSearchResponse,
 * API Практикума может вернуть либо массив, либо объект с полем
 * `response`. На всё остальное (ошибка, пустой ответ) возвращаем пустой
 * массив — это удобно, потому что потом по `.length` мы решаем, показывать
 * ли счётчик участников в шапке диалога.
 */
export function parseChatUsersResponse(data: unknown): UserData[] {
  if (Array.isArray(data)) {
    return data as UserData[];
  }
  if (data !== null && typeof data === 'object' && 'response' in data) {
    const { response } = data as { response: unknown };
    if (Array.isArray(response)) {
      return response as UserData[];
    }
  }
  return [];
}
