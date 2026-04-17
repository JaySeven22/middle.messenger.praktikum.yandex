import Router from './framework/router';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { ChatPage } from './pages/Chat';
import { ProfilePage } from './pages/Profile';
import { ProfileEditPage } from './pages/ProfileEdit';
import { ErrorPage } from './pages/ErrorPage';
import { PasswordEditPage } from './pages/PasswordEdit';
import type { RouteBlockConstructor } from './framework/route';
import ChatAPI from './pages/Chat/chat.api';
import store from './framework/store';

let routerInstance: Router | null = null;

export function getRouter(): Router {
  if (!routerInstance) {
    throw new Error('Router is not initialized');
  }
  return routerInstance;
}

function pageNameToPath(name: string): string {
  return name === '' ? '/' : `/${name}`;
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
      users: [
        { name: 'Марина Кузнецова', lastMessage: 'lorem ipsum dolor sit amet lorem ipsum dolor sit amet', time: '09:23', unreadCount: 1 },
        { name: 'Тимур Бобров', lastMessage: 'lorem ipsum dolor sit amet lorem ipsum dolor sit amet', time: '08:45', unreadCount: 3 },
        { name: 'Олег Петров', lastMessage: 'lorem ipsum dolor sit amet lorem ipsum dolor sit amet', time: 'Вчера', isOwn: true, active: true },
      ],
      activeChat: {
        name: 'Олег Петров',
        messages: [
          { dateSeparator: '5 марта' },
          { text: 'lorem ipsum dolor sit amet lorem ipsum dolor sit amet', time: '14:20' },
          { text: 'lorem ipsum dolor sit amet lorem ipsum dolor sit amet', time: '14:22' },
        ],
      },
      onNavigate: navigate,
    });
  }
  componentDidMount(): void {
    const chatAPI = new ChatAPI();
    chatAPI.create().catch(() => store.setState('chat', { error: 'Ошибка при создании чата' }));
    chatAPI.request().then(() => store.setState('chat', { response: 'Всн супер гуд' }));
    console.log('componentDidMount', chatAPI);
    console.log('componentDidMount', store);
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
      passwordOld: '123456',
      passwordNew: '123456',
      passwordNewRepeat: '123456',
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

export function initRouter(): void {
  routerInstance = new Router('#app');

  routerInstance
    .use('/', LoginRoute)
    .use('/register', RegisterRoute)
    .use('/chat', ChatRoute as unknown as RouteBlockConstructor)
    .use('/profile', ProfileRoute)
    .use('/profileEdit', ProfileEditRoute)
    .use('/passwordEdit', PasswordEditRoute)
    .useFallback(NotFoundRoute);
    

  routerInstance.start();
}
