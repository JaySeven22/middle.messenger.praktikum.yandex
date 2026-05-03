import type { Indexed } from '../../utils/merge';
import type { ChatSidebarItem } from '../../entities/Chat';
import { resolveAvatar } from '../User';
import { parseChatsResponse } from './parseChatsResponse';
import { parseUserSearchResponse } from './parseUserSearchResponse';
import { parseChatUsersResponse } from './parseChatUsersResponse';
import { mapChatsToSidebarItems } from './mapChatsToSidebarItems';
import { mapSearchUsersToSidebarItems } from './mapSearchUsersToSidebarItems';

/**
 * Главный селектор страницы чата для `connect`: собирает из состояния
 * стора всё, что нужно шаблону `ChatPage`.
 *
 * Что здесь происходит:
 *
 * 1. Читает и нормализует список чатов через parseChatsResponse.
 * 2. Определяет, что показывать в левом сайдбаре:
 *    - если пользователь что-то набрал в строке поиска
 *      (`state.userSearchInput` непустой), — показываем результаты
 *      поиска пользователей через mapSearchUsersToSidebarItems;
 *    - иначе — обычный список чатов через mapChatsToSidebarItems,
 *      с подсветкой выбранного.
 * 3. Вычисляет `activeChat` — объект для правой части экрана:
 *    имя, аватар, (позже) сообщения. Добавляется только если чат выбран
 *    и реально существует в списке чатов.
 * 4. Если в сторе есть список участников выбранного чата
 *    (`state.chatUsers[selectedChatId]`), кладёт `participantsCount` в
 *    `activeChat`. Счётчик отображается в шапке диалога.
 *
 * Возвращает `{ ...state, users, activeChat }` — исходный state плюс
 * подготовленные поля, чтобы connect подмешал их в props компонента.
 */
export function mapChatPageToProps(state: Indexed): Indexed {
  const chats = parseChatsResponse(state.chats);
  const selectedChatId =
    typeof state.selectedChatId === 'number' ? state.selectedChatId : undefined;
  const searchInput = (state.userSearchInput as string | undefined) ?? '';
  const searchTrimmed = searchInput.trim();

  const users: ChatSidebarItem[] =
    searchTrimmed.length > 0
      ? mapSearchUsersToSidebarItems(parseUserSearchResponse(state.users))
      : mapChatsToSidebarItems(chats, selectedChatId);
  const active =
    selectedChatId !== undefined
      ? chats.find((c) => c.id === selectedChatId)
      : undefined;

  const chatUsersMap =
    state.chatUsers && typeof state.chatUsers === 'object'
      ? (state.chatUsers as Record<string, unknown>)
      : {};
  const participantsRaw =
    selectedChatId !== undefined ? chatUsersMap[String(selectedChatId)] : undefined;
  const participants = parseChatUsersResponse(participantsRaw);

  const activeChat = active
    ? {
        id: active.id,
        name: active.title,
        ...(active.avatar ? { avatar: resolveAvatar(active.avatar) } : {}),
        ...(participants.length > 0 ? { participantsCount: participants.length } : {}),
        messages: [] as {
          dateSeparator?: string;
          text?: string;
          time?: string;
          isOwn?: boolean;
          image?: string;
        }[],
      }
    : undefined;

  return {
    ...state,
    users,
    activeChat,
  };
}
