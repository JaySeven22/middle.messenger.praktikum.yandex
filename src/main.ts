import Handlebars from 'handlebars';
import './style.css';
import './components/UserCard/userCard.css';

// Импорт регистрирует partial "userCard" и хелперы (eq, gt, firstLetter)
import './components/UserCard';

// Шаблон страницы — используем {{#each}} для перебора пользователей
const pageTemplate = Handlebars.compile(`
  <h1>Vite + TypeScript Chat: Sprint 1</h1>
  <h2>Контакты</h2>
  <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px;">
    {{#each users}}
      {{> userCard}}
    {{/each}}
  </div>
`);

// Данные для карточек (в реальном приложении пришли бы с сервера)
const context = {
  users: [
    {
      name: 'Алексей',
      status: 'online',
      lastMessage: 'Привет! Как дела?',
      unreadCount: 3,
    },
    {
      name: 'Мария',
      status: 'offline',
      lastMessage: 'Созвонимся завтра?',
      unreadCount: 0,
    },
    {
      name: 'Дмитрий',
      status: 'online',
      lastMessage: 'Отправил pull request, посмотри когда будет время',
      unreadCount: 1,
    },
  ],
};

// Рендерим всё одним вызовом
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = pageTemplate(context);
