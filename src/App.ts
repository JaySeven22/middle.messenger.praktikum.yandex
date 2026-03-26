import type Block from './framework/block';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { ChatPage } from './pages/Chat';
import { ProfilePage } from './pages/Profile';
import { ErrorPage } from './pages/ErrorPage';

export default class App {
  private appElement: HTMLElement;
  private currentPage: string;

  constructor() {
    this.currentPage = '';
    this.appElement = document.getElementById('app')!;
  }

  render() {
    const navigate = (page: string) => this.changePage(page);
    let page: Block;

    switch (this.currentPage) {
      case '':
        page = new LoginPage({ onNavigate: navigate });
        break;
      case 'register':
        page = new RegisterPage({ onNavigate: navigate });
        break;
      case 'chat':
        page = new ChatPage({
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
        break;
      case 'profile':
        page = new ProfilePage({
          email: 'pochta@yandex.ru',
          login: 'ivanivanov',
          firstName: 'Иван',
          secondName: 'Иванов',
          displayName: 'Иван',
          phone: '+7 (909) 967 30 30',
          onNavigate: navigate,
        });
        break;
      default:
        page = new ErrorPage({
          code: 404,
          message: 'Не туда попали',
          linkText: 'Назад к чатам',
          onNavigate: navigate,
        });
        break;
    }

    this.appElement.innerHTML = '';
    const element = page.element();
    if (element) {
      this.appElement.appendChild(element);
    }
  }

  changePage(page: string) {
    this.currentPage = page;
    const path = page ? `/${page}` : '/';
    window.history.pushState({ page }, '', path);
    this.render();
  }
}
