import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';
import { validateField } from '../../utils/validation';

interface ChatPageProps extends BlockOwnProps {
  users?: {
    name: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    isOwn?: boolean;
    active?: boolean;
  }[];
  activeChat?: {
    name: string;
    avatar?: string;
    messages: {
      dateSeparator?: string;
      text?: string;
      time?: string;
      isOwn?: boolean;
      image?: string;
    }[];
  };
  onNavigate?: (page: string) => void;
}

export default class ChatPage extends Block<ChatPageProps> {
  static componentName = 'ChatPage';

  protected template = `
    <div class="chat-page">
      <nav class="chat-page__sidebar" aria-label="Список чатов">
        <header class="chat-page__sidebar-header">
          <a ref="profileLink" class="chat-page__profile-link" href="#">Профиль &rsaquo;</a>
          {{SearchInput placeholder="Поиск"}}
        </header>
        <ul class="chat-page__contacts" role="list">
          {{#each users}}
            <li role="listitem">
              {{UserCard name=name lastMessage=lastMessage time=time unreadCount=unreadCount isOwn=isOwn active=active}}
            </li>
          {{/each}}
        </ul>
      </nav>

      <main class="chat-page__dialog">
        {{#if activeChat}}
          <header class="chat-page__dialog-header">
            <div class="chat-page__dialog-user">
              <div class="chat-page__dialog-avatar">
                {{#if activeChat.avatar}}
                  <img src="{{activeChat.avatar}}" alt="{{activeChat.name}}" />
                {{/if}}
              </div>
              <h1 class="chat-page__dialog-name">{{activeChat.name}}</h1>
            </div>
            <button class="chat-page__menu-btn" type="button" aria-label="Меню"></button>
          </header>

          <section class="chat-page__messages" aria-label="Сообщения">
            {{#each activeChat.messages}}
              {{#if dateSeparator}}
                <time class="chat-page__date-separator">{{dateSeparator}}</time>
              {{else}}
                <article class="chat-page__message {{#if isOwn}}chat-page__message--own{{/if}}">
                  <div class="chat-page__message-bubble">
                    {{#if image}}
                      <img class="chat-page__message-image" src="{{image}}" alt="Изображение" />
                    {{/if}}
                    {{#if text}}
                      <p class="chat-page__message-text">{{text}}</p>
                    {{/if}}
                    <time class="chat-page__message-meta">
                      {{#if isOwn}}
                        <span class="chat-page__message-check" aria-label="Прочитано">✓</span>
                      {{/if}}
                      {{time}}
                    </time>
                  </div>
                </article>
              {{/if}}
            {{/each}}
          </section>

          <footer class="chat-page__compose">
            <form ref="messageForm" class="chat-page__compose-form">
              <input
                class="chat-page__compose-input"
                type="text"
                name="message"
                placeholder="Сообщение"
                autocomplete="off"
              />
              <button class="chat-page__compose-send" type="submit" aria-label="Отправить">
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
                  <path d="M12.5 6L1 1L3.5 6M12.5 6L1 11L3.5 6M12.5 6H3.5" stroke="white" stroke-width="1.5"/>
                </svg>
              </button>
            </form>
          </footer>
        {{else}}
          <section class="chat-page__placeholder">
            <p>Выберите чат чтобы отправить сообщение</p>
          </section>
        {{/if}}
      </main>
    </div>
  `;

  protected componentDidMount() {
    this.refs.profileLink?.addEventListener('click', (e) => {
      e.preventDefault();
      this.props.onNavigate?.('profile');
    });

    const messageInput = this.element()?.querySelector<HTMLInputElement>(
      '.chat-page__compose-input',
    );

    if (messageInput) {
      messageInput.addEventListener('focus', () => {
        messageInput.classList.remove('chat-page__compose-input--error');
      });

      messageInput.addEventListener('blur', () => {
        if (messageInput.value.trim()) return;
        const error = validateField('message', messageInput.value);
        if (error) {
          messageInput.classList.add('chat-page__compose-input--error');
        }
      });
    }

    this.refs.messageForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = (e.target as HTMLFormElement).querySelector<HTMLInputElement>(
        'input[name="message"]',
      );
      if (!input) return;

      const error = validateField('message', input.value);
      if (error) {
        input.classList.add('chat-page__compose-input--error');
        return;
      }

      input.classList.remove('chat-page__compose-input--error');
      console.log('Message:', input.value);
      (e.target as HTMLFormElement).reset();
    });
  }
}
