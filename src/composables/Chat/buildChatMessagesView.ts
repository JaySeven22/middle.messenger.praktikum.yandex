import type { ChatMessageRaw, ChatMessageView } from '../../entities/Chat';

/**
 * Преобразует список «сырых» сообщений из стора в массив элементов
 * для шаблона `activeChat.messages`.
 *
 * - Сортирует по времени по возрастанию (старые сверху, новые снизу).
 * - Дедупит по `id`.
 * - Между сообщениями разных дней вставляет элемент `{ dateSeparator }`.
 * - У элементов сообщения проставляет `isOwn` (сравнение `user_id` с
 *   текущим пользователем) и `time` (HH:MM).
 */
export function buildChatMessagesView(
  raw: ChatMessageRaw[],
  currentUserId: number | null,
): ChatMessageView[] {
  const seen = new Set<number>();
  const sorted = [...raw]
    .filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    })
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  const result: ChatMessageView[] = [];
  let lastDayKey: string | null = null;

  for (const m of sorted) {
    const date = new Date(m.time);
    if (Number.isNaN(date.getTime())) continue;

    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if (dayKey !== lastDayKey) {
      result.push({ dateSeparator: formatDateSeparator(date) });
      lastDayKey = dayKey;
    }

    result.push({
      text: m.content,
      time: formatTime(date),
      isOwn: currentUserId !== null && m.user_id === currentUserId,
    });
  }

  return result;
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatDateSeparator(d: Date): string {
  const now = new Date();
  const isSameDay = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(d, now)) return 'Сегодня';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(d, yesterday)) return 'Вчера';

  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString('ru-RU', sameYear
    ? { day: 'numeric', month: 'long' }
    : { day: 'numeric', month: 'long', year: 'numeric' },
  );
}
