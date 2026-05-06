import Router from './framework/router';
import { authRouteMiddleware } from './framework/authRouting';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { ChatPage } from './pages/Chat';
import { ProfilePage } from './pages/Profile';
import { ProfileEditPage } from './pages/ProfileEdit';
import { ErrorPage } from './pages/ErrorPage';
import { PasswordEditPage } from './pages/PasswordEdit';
import type { RouteBlockConstructor } from './framework/route';

let routerInstance: Router | null = null;

export function getRouter(): Router {
  if (!routerInstance) {
    throw new Error('Router is not initialized');
  }
  return routerInstance;
}

function pageNameToPath(name: string): string {
  if (name === '') return '/';
  if (name === 'register') return '/sign-up';
  return `/${name}`;
}

function navigate(page: string): void {
  getRouter().go(pageNameToPath(page));
}

class LoginRoute extends LoginPage {
  constructor() {
    super({ onNavigate: navigate });
  }
}

class RegisterRoute extends RegisterPage {
  constructor() {
    super({ onNavigate: navigate });
  }
}

class ChatRoute extends ChatPage {
  constructor() {
    super({
      users: [],
      onNavigate: navigate,
    });
  }
}

class ProfileRoute extends ProfilePage {
  constructor() {
    super({
      email: 'pochta@yandex.ru',
      login: 'ivanivanov',
      firstName: 'Иван',
      secondName: 'Иванов',
      displayName: 'Иван',
      phone: '+79099673030',
      onNavigate: navigate,
    });
  }
}

class ProfileEditRoute extends ProfileEditPage {
  constructor() {
    super({
      email: 'pochta@yandex.ru',
      login: 'ivanivanov',
      firstName: 'Иван',
      secondName: 'Иванов',
      displayName: 'Иван',
      phone: '+79099673030',
      onNavigate: navigate,
    });
  }
}

class PasswordEditRoute extends PasswordEditPage {
  constructor() {
    super({
      passwordOld: '',
      passwordNew: '',
      passwordNewRepeat: '',
      onNavigate: navigate,
    });
  }
}

class NotFoundRoute extends ErrorPage {
  constructor() {
    super({
      code: 404,
      message: 'Не туда попали',
      linkText: 'Назад к чатам',
      onNavigate: navigate,
    });
  }
}

class ServerErrorRoute extends ErrorPage {
  constructor() {
    super({
      code: 500,
      message: 'Мы уже фиксим',
      linkText: 'Назад к чатам',
      onNavigate: navigate,
    });
  }
}

export function initRouter(): void {
  routerInstance = new Router('#app');

  routerInstance
    .useMiddleware(authRouteMiddleware)
    .use('/', LoginRoute)
    .use('/sign-up', RegisterRoute)
    .use('/messenger', ChatRoute as unknown as RouteBlockConstructor)
    .use('/settings', ProfileRoute as unknown as RouteBlockConstructor)
    .use('/settingsEdit', ProfileEditRoute as unknown as RouteBlockConstructor)
    .use('/passwordEdit', PasswordEditRoute as unknown as RouteBlockConstructor)
    .use('/500', ServerErrorRoute)
    .useFallback(NotFoundRoute);

  window.addEventListener('api:server-error', () => {
    if (window.location.pathname !== '/500') {
      routerInstance?.go('/500');
    }
  });

  routerInstance.start();
}
