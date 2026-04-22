import type { UserData } from '../../entities/User';
import type { ChatSidebarItem } from '../../entities/Chat';
import { resolveAvatar } from '../User';
import { displayNameFromUser } from './displayNameFromUser';

/**
 * Преобразует результаты поиска пользователей (`UserData[]`) в карточки
 * для того же левого сайдбара чата.
 *
 * Когда пользователь что-то вводит в строку поиска, вместо списка чатов
 * в сайдбаре показываются найденные пользователи — и их надо отрисовать
 * тем же компонентом `UserCard`, что и обычные чаты. Эта функция и
 * отвечает за такое превращение:
 *
 * - Имя берёт через displayNameFromUser.
 * - В `lastMessage` кладёт `@login` (или email как запасной вариант),
 *   чтобы в карточке что-то было написано под именем.
 * - `time` пустая — время последнего сообщения тут неактуально.
 * - Проставляет `isSearchResult: true` — по этому флагу шаблон
 *   отрисовывает элемент как "результат поиска" (ссылку на пользователя,
 *   а не на чат).
 */
export function mapSearchUsersToSidebarItems(users: UserData[]): ChatSidebarItem[] {
  return users.map((u) => ({
    id: u.id,
    name: displayNameFromUser(u),
    lastMessage: u.login ? `@${u.login}` : (u.email ?? ''),
    time: '',
    isSearchResult: true,
    ...(u.avatar?.trim() ? { avatar: resolveAvatar(u.avatar) } : {}),
  }));
}
