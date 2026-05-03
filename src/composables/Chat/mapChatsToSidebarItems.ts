import type { ChatsData, ChatSidebarItem } from '../../entities/Chat';
import { resolveAvatar } from '../User';
import { formatMessageTime } from './formatMessageTime';

/**
 * Преобразует массив чатов из API (`ChatsData[]`) в массив карточек
 * для левого сайдбара чата (`ChatSidebarItem[]`).
 *
 * Что делает:
 * - Подставляет дефолты вместо отсутствующих полей последнего сообщения.
 * - Форматирует время через formatMessageTime.
 * - Кладёт `unreadCount` только если он > 0 (чтобы в шаблоне удобнее
 *   было показывать/прятать бейдж через `{{#if unreadCount}}`).
 * - Помечает карточку `active: true`, если её `id` совпадает с
 *   `selectedChatId` — на это завязано подсвечивание выбранного чата.
 * - Прогоняет аватар через resolveAvatar
 */
export function mapChatsToSidebarItems(
  chats: ChatsData[],
  selectedChatId?: number,
): ChatSidebarItem[] {
  return chats.map((c) => ({
    id: c.id,
    name: c.title,
    lastMessage: c.last_message?.content ?? '',
    time: formatMessageTime(c.last_message?.time),
    ...(c.unread_count > 0 ? { unreadCount: c.unread_count } : {}),
    active: c.id === selectedChatId,
    ...(c.avatar ? { avatar: resolveAvatar(c.avatar) } : {}),
  }));
}
