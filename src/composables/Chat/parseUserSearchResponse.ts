import type { UserData } from '../../entities/User';

/**
 * Нормализует ответ `POST /user/search` к виду `UserData[]`.
 *
 * Поддерживает два формата ответа API (голый массив и обёртка
 * `{ response: UserData[] }`) и возвращает пустой массив на всё неожиданное
 * (не массив / не объект / нет поля `response`).
 *
 * Используется при поиске пользователей в боковой панели чатов и при
 * добавлении пользователя в чат — в обоих случаях результат напрямую
 * отдаётся в стор / в фильтрацию по точному совпадению логина.
 */
export function parseUserSearchResponse(data: unknown): UserData[] {
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
