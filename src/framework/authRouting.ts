import store from './store';
import type { Indexed } from '../utils/merge';
import LoginPageAPI from '../pages/Login/login.api';

// Пользователь считается авторизованным, если в сторе есть профиль с id
export function isAuthenticated(): boolean {
  const user = store.getState().user as { id?: number } | null | undefined;
  return typeof user?.id === 'number';
}

// Запрос текущего пользователя 
export async function syncAuthFromApi(): Promise<void> {
  const api = new LoginPageAPI();
  try {
    const data = await api.authUser();
    if (data && typeof data === 'object' && 'id' in (data as object)) {
      store.setState('user', data as Indexed);
    } else {
      store.setState('user', null as unknown);
    }
  } catch {
    store.setState('user', null as unknown);
  }
}

export function clearAuthUser(): void {
  store.setState('user', null as unknown);
}

const PUBLIC_PATHS = ['/', '/sign-up'] as const;

/**
 * Middleware роутера: куда перенаправить.
 * Гости: только `/` и `/sign-up`. Авторизованные: с логина/регистрации — в чат.
 */
export function authRouteMiddleware(pathname: string): string | null {
  const path = pathname || '/';

  // Технические страницы ошибок доступны всем — без редиректов.
  if (path === '/500' || path === '/404') {
    return null;
  }

  if (path === '/register') {
    return '/sign-up';
  }

  const authed = isAuthenticated();

  if (!authed) {
    if ((PUBLIC_PATHS as readonly string[]).includes(path)) {
      return null;
    }
    return '/';
  }

  if ((PUBLIC_PATHS as readonly string[]).includes(path)) {
    return '/messenger';
  }

  return null;
}
