import { RESOURCES_BASE } from '../../framework/env';

/**
 * Превращает путь к аватару, который приходит с бэка, в полный URL,
 * по которому картинку можно запросить напрямую.
 */
export function resolveAvatar(path: string | undefined): string {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return `${RESOURCES_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}
