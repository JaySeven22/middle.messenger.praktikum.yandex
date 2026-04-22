import type { UserData } from '../../entities/User';

/**
 * Возвращает человекочитаемое имя пользователя для отображения
 * в карточке контакта (результаты поиска пользователей и т.п.).
 *
 * Приоритет:
 * 1. `display_name` — то, как пользователь сам себя назвал в профиле.
 * 2. Склейка `first_name + second_name`, если дисплейное имя не задано.
 * 3. Логин как запасной вариант, если ни имени, ни фамилии нет.
 *
 * Гарантирует, что в UI не будет висеть пустая строка или `undefined`.
 */
export function displayNameFromUser(u: UserData): string {
  const dn = u.display_name?.trim();
  if (dn) return dn;
  const full = `${u.first_name ?? ''} ${u.second_name ?? ''}`.trim();
  if (full) return full;
  return u.login ?? '';
}
