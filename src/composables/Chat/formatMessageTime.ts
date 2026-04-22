/**
 * Форматирует время последнего сообщения для отображения в карточке
 * чата в сайдбаре.
 */
export function formatMessageTime(timeStr: string | undefined): string {
  if (!timeStr) return '';
  const d = new Date(timeStr);
  if (Number.isNaN(d.getTime())) return timeStr;
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('ru-RU', { weekday: 'short' });
}
