import Block from '../../framework/block';
import ChatWebSocket from '../../framework/chatSocket';
import { validateField } from '../../utils/validation';
import connect from '../../utils/connectToStore';
import store from '../../framework/store';
import ChatAPI from './chat.api';
import {
  parseChatsResponse,
  parseUserSearchResponse,
  parseChatUsersResponse,
  parseChatMessagesResponse,
  mapChatPageToProps,
} from '../../composables/Chat';
import type { DropdownMenuItem } from '../../entities/DropdownMenu';
import type { ModalField } from '../../entities/Modal';
import type {
  AddUserToChatData,
  ChatPageProps,
  ChatMessageRaw,
} from '../../entities/Chat';
import type { Indexed } from '../../utils/merge';

const DEFAULT_MENU_ITEMS: DropdownMenuItem[] = [
  { label: 'Добавить пользователя', action: 'add-user', icon: 'add' },
  { label: 'Удалить пользователя', action: 'remove-user', icon: 'remove' },
];

const DEFAULT_ATTACH_MENU_ITEMS: DropdownMenuItem[] = [
  { label: 'Фото или Видео', action: 'attach-media', iconSrc: '/media.svg' },
  { label: 'Файл', action: 'attach-file', iconSrc: '/file.svg' },
  { label: 'Локация', action: 'attach-location', iconSrc: '/location.svg' },
];

const ADD_USER_FIELDS: ModalField[] = [
  { id: 1, label: 'Логин', name: 'login', type: 'text' },
];

const CREATE_CHAT_FIELDS: ModalField[] = [
  { label: 'Название', name: 'title', type: 'text', placeholder: 'Название чата' },
];

class ChatPage extends Block<ChatPageProps> {
  static componentName = 'ChatPage';

  private chatAPI = new ChatAPI();

  private chatSocket = new ChatWebSocket();

  private searchDebounceTimer: number | null = null;

  private searchRequestSeq = 0;

  private lastFetchedChatId: number | null = null;

  private chatUsersRequestSeq = 0;

  private socketChatId: number | null = null;

  private shouldScrollMessages = false;

  private isParticipantsOpen = false;

  constructor(props = {} as ChatPageProps) {
    super({
      menuItems: DEFAULT_MENU_ITEMS,
      attachMenuItems: DEFAULT_ATTACH_MENU_ITEMS,
      addUserFields: ADD_USER_FIELDS,
      removeUserFields: ADD_USER_FIELDS,
      createChatFields: CREATE_CHAT_FIELDS,
      ...props,
    });
    this.props.onMenuSelect ??= this.handleMenuSelect;
    this.props.onAttachMenuSelect ??= this.handleAttachMenuSelect;
    this.props.onAddUserSubmit ??= this.handleAddUserSubmit;
    this.props.onRemoveUserSubmit ??= this.handleRemoveUserSubmit;
    this.props.onCreateChatSubmit ??= this.handleCreateChatSubmit;
  }

  public setProps(next: Partial<ChatPageProps>): void {
    const prevChatId = this.props.activeChat?.id;
    const prevMessagesLen = this.props.activeChat?.messages?.length ?? 0;
    super.setProps(next);
    const nextChatId = this.props.activeChat?.id;
    const nextMessagesLen = this.props.activeChat?.messages?.length ?? 0;

    if (prevChatId !== nextChatId) {
      void this.syncChatSocket(nextChatId);
      this.shouldScrollMessages = true;
    } else if (nextMessagesLen !== prevMessagesLen) {
      this.shouldScrollMessages = true;
    }

    if (this.shouldScrollMessages) {
      this.shouldScrollMessages = false;
      this.scrollMessagesToBottom();
    }

    if (prevChatId !== nextChatId) {
      this.isParticipantsOpen = false;
    } else if (this.isParticipantsOpen) {
      this.applyParticipantsOpenState();
    }
  }

  private async syncChatSocket(chatId: number | undefined): Promise<void> {
    this.chatSocket.close();
    this.socketChatId = null;
    if (typeof chatId !== 'number' || !Number.isFinite(chatId)) {
      return;
    }
    const user = store.getState().user as Indexed | null | undefined;
    const userId = typeof user?.id === 'number' ? user.id : null;
    if (userId === null) {
      return;
    }

    try {
      const raw = await this.chatAPI.getChatToken(chatId);
      const token =
        typeof raw === 'object' &&
        raw !== null &&
        'token' in raw &&
        typeof (raw as { token: unknown }).token === 'string'
          ? (raw as { token: string }).token
          : null;
      if (!token) {
        return;
      }

      this.socketChatId = chatId;
      store.setState(`messages.${chatId}`, []);

      this.chatSocket.open(userId, chatId, token, {
        onOpen: () => {
          this.chatSocket.sendJson({
            type: 'get old',
            content: '0',
          });
        },
        onMessage: (message) => {
          if (
            message &&
            typeof message === 'object' &&
            !Array.isArray(message) &&
            (message as { type?: unknown }).type === 'user connected'
          ) {
            return;
          }
          this.handleIncomingChatMessage(chatId, message);
        },
        onError: (e) => {
          console.log('[chat ws] error', e);
        },
        onClose: (e) => {
          console.log('[chat ws] close', e.code, e.reason);
        },
      });
    } catch (err) {
      console.log('[chat ws] token', err);
    }
  }

  private handleIncomingChatMessage(chatId: number, payload: unknown): void {
    if (this.socketChatId !== chatId) {
      return;
    }
    const incoming = parseChatMessagesResponse(payload);
    if (incoming.length === 0) {
      return;
    }
    const state = store.getState();
    const messagesMap =
      state.messages && typeof state.messages === 'object'
        ? (state.messages as Record<string, unknown>)
        : {};
    const existing = Array.isArray(messagesMap[String(chatId)])
      ? (messagesMap[String(chatId)] as ChatMessageRaw[])
      : [];

    const seen = new Set(existing.map((m) => m.id));
    const merged = [...existing];
    for (const m of incoming) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      merged.push(m);
    }
    store.setState(`messages.${chatId}`, merged);
  }

  private scrollMessagesToBottom(): void {
    requestAnimationFrame(() => {
      const list = this.element()?.querySelector<HTMLElement>('.chat-page__messages');
      if (list) {
        list.scrollTop = list.scrollHeight;
      }
    });
  }

  private getParticipantsNodes(): {
    trigger: HTMLButtonElement | null;
    popover: HTMLElement | null;
  } {
    const root = this.element();
    if (!(root instanceof HTMLElement)) return { trigger: null, popover: null };
    return {
      trigger: root.querySelector<HTMLButtonElement>('.chat-page__dialog-participants'),
      popover: root.querySelector<HTMLElement>('.chat-page__participants-popover'),
    };
  }

  private applyParticipantsOpenState(): void {
    const { trigger, popover } = this.getParticipantsNodes();
    if (!trigger || !popover) return;
    if (this.isParticipantsOpen) {
      popover.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    } else {
      popover.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }
  }

  private openParticipants(): void {
    if (this.isParticipantsOpen) return;
    this.isParticipantsOpen = true;
    this.applyParticipantsOpenState();
    document.addEventListener('click', this.handleParticipantsOutsideClick, true);
    document.addEventListener('keydown', this.handleParticipantsEscape);
  }

  private closeParticipants(): void {
    if (!this.isParticipantsOpen) return;
    this.isParticipantsOpen = false;
    this.applyParticipantsOpenState();
    document.removeEventListener('click', this.handleParticipantsOutsideClick, true);
    document.removeEventListener('keydown', this.handleParticipantsEscape);
  }

  private handleParticipantsOutsideClick = (e: Event): void => {
    const root = this.element();
    const wrapper = root?.querySelector('.chat-page__participants');
    const target = e.target as Node | null;
    if (!wrapper || !target) return;
    if (!wrapper.contains(target)) this.closeParticipants();
  };

  private handleParticipantsEscape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') this.closeParticipants();
  };

  private handleMenuSelect = (action: string): void => {
    if (action === 'add-user') {
      this.openModal('addUserModal');
      this.clearAddUserLoginError();
      return;
    }
    if (action === 'remove-user') {
      this.openModal('removeUserModal');
      this.clearRemoveUserLoginError();
      return;
    }
  };

  private handleAttachMenuSelect = (action: string): void => {
    console.log('attach menu:', action);
  };

  private handleAddUserSubmit = (values: Record<string, string>): Promise<void> => {
    const login = (values.login ?? '').trim();
    this.clearAddUserLoginError();

    if (!login) {
      this.showAddUserLoginError('Укажите логин пользователя');
      return Promise.reject(new Error('empty login'));
    }

    return this.chatAPI.searchUsers(login)
      .then((raw) => {
        const found = parseUserSearchResponse(raw).filter((u) => u.login === login);

        if (found.length === 0) {
          this.showAddUserLoginError('Пользователь не найден');
          return Promise.reject(new Error('user not found'));
        }

        if (found.length > 1) {
          this.showAddUserLoginError('Укажите полный логин пользователя');
          return Promise.reject(new Error('ambiguous login'));
        }

        const chatId = this.props.activeChat?.id ?? 0;
        const data: AddUserToChatData = {
          users: [found[0].id],
          chatId,
        };

        return this.chatAPI.addUserToChat(data).then(() => {
          if (chatId) {
            this.lastFetchedChatId = null;
            this.fetchChatUsers(chatId);
          }
        });
      })
      .catch((err) => {
        window.alert('Произошла ошибка при добавлении пользователя');
        console.log('err', err);
        throw err;
      });
  };

  private handleRemoveUserSubmit = (values: Record<string, string>): Promise<void> => {
    const login = (values.login ?? '').trim();
    this.clearRemoveUserLoginError();

    if (!login) {
      this.showRemoveUserLoginError('Укажите логин пользователя');
      return Promise.reject(new Error('empty login'));
    }

    return this.chatAPI.searchUsers(login)
      .then((raw) => {
        const found = parseUserSearchResponse(raw).filter((u) => u.login === login);

        if (found.length === 0) {
          this.showRemoveUserLoginError('Пользователь не найден');
          return Promise.reject(new Error('user not found'));
        }

        if (found.length > 1) {
          this.showRemoveUserLoginError('Укажите полный логин пользователя');
          return Promise.reject(new Error('ambiguous login'));
        }

        const chatId = this.props.activeChat?.id ?? 0;
        const data: AddUserToChatData = {
          users: [found[0].id],
          chatId,
        };

        return this.chatAPI.delteUserFromChat(data).then(() => {
          if (chatId) {
            this.lastFetchedChatId = null;
            this.fetchChatUsers(chatId);
          }
        });
      })
      .catch((err) => {
        window.alert('Произошла ошибка при удалении пользователя');
        console.log('err', err);
        throw err;
      });
  };

  private getAddUserLoginField(): HTMLElement | null {
    const modalEl = this.refs.addUserModal;
    if (!(modalEl instanceof HTMLElement)) return null;
    const input = modalEl.querySelector<HTMLInputElement>('input[name="login"]');
    return input?.closest<HTMLElement>('.input-field') ?? null;
  }

  private showAddUserLoginError(message: string): void {
    const field = this.getAddUserLoginField();
    if (!field) return;
    field.classList.add('input-field--error');
    let errorEl = field.querySelector<HTMLElement>('.input-field__error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'input-field__error';
      field.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  private clearAddUserLoginError(): void {
    const field = this.getAddUserLoginField();
    if (!field) return;
    field.classList.remove('input-field--error');
    field.querySelector('.input-field__error')?.remove();
  }

  private getRemoveUserLoginField(): HTMLElement | null {
    const modalEl = this.refs.removeUserModal;
    if (!(modalEl instanceof HTMLElement)) return null;
    const input = modalEl.querySelector<HTMLInputElement>('input[name="login"]');
    return input?.closest<HTMLElement>('.input-field') ?? null;
  }

  private showRemoveUserLoginError(message: string): void {
    const field = this.getRemoveUserLoginField();
    if (!field) return;
    field.classList.add('input-field--error');
    let errorEl = field.querySelector<HTMLElement>('.input-field__error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'input-field__error';
      field.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  private clearRemoveUserLoginError(): void {
    const field = this.getRemoveUserLoginField();
    if (!field) return;
    field.classList.remove('input-field--error');
    field.querySelector('.input-field__error')?.remove();
  }

  private handleCreateChatSubmit = (values: Record<string, string>): void => {
    this.chatAPI.createChat(values.title).then(() => {
      this.chatAPI.getChats().then((list) => {
        store.setState('chats', parseChatsResponse(list));
      }).catch((err) => {
        window.alert('Произошла ошибка при получении чатов');
        console.log('err', err);
      });
    }).catch((err) => {
      window.alert('Произошла ошибка при создании чата');
      console.log('err', err);
    });
  };

  private openModal(refName: string): void {
    const modalEl = this.refs[refName];
    if (modalEl instanceof HTMLElement) {
      modalEl.classList.add('modal--open');
      const firstInput = modalEl.querySelector<HTMLInputElement>('.modal__form input');
      firstInput?.focus();
    }
  }

  /** После setState поле пересобирается — возвращаем фокус и курсор в конец. */
  private restoreSearchInputFocus(): void {
    requestAnimationFrame(() => {
      const input = this.element()?.querySelector<HTMLInputElement>('.search-input__input');
      if (!(input instanceof HTMLInputElement)) return;
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
    });
  }

  protected componentDidMount(): void {
    this.chatAPI.getChats().then((data) => {
      store.setState('chats', parseChatsResponse(data));
    }).catch((err) => {
      window.alert('Произошла ошибка при получении чатов');
      console.log('err', err);
    });

    this.syncChatUsers();
  }

  protected componentWillUnmount(): void {
    if (this.searchDebounceTimer !== null) {
      window.clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = null;
    }
    document.removeEventListener('click', this.handleParticipantsOutsideClick, true);
    document.removeEventListener('keydown', this.handleParticipantsEscape);
  }

  /** Подтягивает участников выбранного чата, если они ещё не в сторе. */
  private syncChatUsers(): void {
    const state = store.getState();
    const chatId =
      typeof state.selectedChatId === 'number' ? state.selectedChatId : null;

    if (chatId === null) {
      this.lastFetchedChatId = null;
      return;
    }

    if (chatId === this.lastFetchedChatId) return;

    const usersMap =
      state.chatUsers && typeof state.chatUsers === 'object'
        ? (state.chatUsers as Record<string, unknown>)
        : null;
    if (usersMap && Object.prototype.hasOwnProperty.call(usersMap, String(chatId))) {
      this.lastFetchedChatId = chatId;
      return;
    }

    this.fetchChatUsers(chatId);
  }

  private fetchChatUsers(chatId: number): void {
    this.lastFetchedChatId = chatId;
    const seq = ++this.chatUsersRequestSeq;
    this.chatAPI.getUsersInChat(chatId)
      .then((raw) => {
        if (seq !== this.chatUsersRequestSeq) return;
        const users = parseChatUsersResponse(raw);
        store.setState(`chatUsers.${chatId}`, users);
      })
      .catch((err) => {
        if (seq !== this.chatUsersRequestSeq) return;
        console.log('get chat users err', err);
        if (this.lastFetchedChatId === chatId) {
          this.lastFetchedChatId = null;
        }
      });
  }

  protected events = {
    input: (e: Event) => {
      const target = e.target as HTMLElement;
      const inputEl = target.closest<HTMLInputElement>('.search-input__input');
      if (!inputEl) return;

      const q = inputEl.value.trim();
      if (this.searchDebounceTimer !== null) {
        window.clearTimeout(this.searchDebounceTimer);
        this.searchDebounceTimer = null;
      }

      if (!q) {
        store.setState('userSearchInput', '');
        store.setState('users', []);
        this.restoreSearchInputFocus();
        return;
      }

      this.searchDebounceTimer = window.setTimeout(() => {
        this.searchDebounceTimer = null;
        const root = this.element();
        const currentInput = root?.querySelector<HTMLInputElement>('.search-input__input');
        const raw = currentInput?.value ?? '';
        const queryForApi = raw.trim();
        if (!queryForApi) {
          store.setState('userSearchInput', '');
          store.setState('users', []);
          this.restoreSearchInputFocus();
          return;
        }

        const seq = ++this.searchRequestSeq;
        this.chatAPI.searchUsers(queryForApi)
          .then((data) => {
            if (seq !== this.searchRequestSeq) return;
            const users = parseUserSearchResponse(data);
            store.setState('userSearchInput', raw);
            store.setState('users', users);
            this.restoreSearchInputFocus();
          })
          .catch((err) => {
            if (seq !== this.searchRequestSeq) return;
            console.log('search users err', err);
            store.setState('userSearchInput', raw);
            store.setState('users', []);
            this.restoreSearchInputFocus();
          });
      }, 500);
    },
    click: (e: Event) => {
      const target = e.target as HTMLElement;
      const contactItem = target.closest<HTMLLIElement>('.chat-page__contact-item[data-chat-id]');
      if (contactItem?.dataset.chatId) {
        e.preventDefault();
        store.setState('selectedChatId', Number(contactItem.dataset.chatId));
        this.syncChatUsers();
        return;
      }
      if (target.closest('.chat-page__create-chat-btn')) {
        e.preventDefault();
        this.openModal('createChatModal');
        return;
      }
      if (target.closest('.chat-page__dialog-participants')) {
        e.preventDefault();
        e.stopPropagation();
        if (this.isParticipantsOpen) {
          this.closeParticipants();
        } else {
          this.openParticipants();
        }
        return;
      }
      if (target.closest('.chat-page__profile-link')) {
        e.preventDefault();
        this.chatSocket.close();
        this.props.onNavigate?.('settings');
        return;
      }
    },
    focusin: (e: Event) => {
      const target = e.target as HTMLElement;
      const messageInput = target.closest<HTMLInputElement>('.chat-page__compose-input');
      if (messageInput) {
        messageInput.classList.remove('chat-page__compose-input--error');
      }
    },
    focusout: (e: Event) => {
      const target = e.target as HTMLElement;
      const messageInput = target.closest<HTMLInputElement>('.chat-page__compose-input');
      if (!messageInput || messageInput.value.trim()) return;
      const error = validateField('message', messageInput.value);
      if (error) {
        messageInput.classList.add('chat-page__compose-input--error');
      }
    },
    submit: (e: Event) => {
      const form = e.target as HTMLFormElement;
      if (!form.classList.contains('chat-page__compose-form')) return;

      e.preventDefault();
      const input = form.querySelector<HTMLInputElement>('input[name="message"]');
      if (!input) return;

      const value = input.value;
      const error = validateField('message', value);
      if (error) {
        input.classList.add('chat-page__compose-input--error');
        return;
      }

      input.classList.remove('chat-page__compose-input--error');

      const text = value.trim();
      if (!text) return;
      if (this.chatSocket.getReadyState() !== WebSocket.OPEN) return;

      this.chatSocket.sendJson({ type: 'message', content: text });
      input.value = '';
    },
  };

  protected template = `
    <div class="chat-page">
      <nav class="chat-page__sidebar" aria-label="Список чатов">
        <header class="chat-page__sidebar-header">
          <div class="chat-page__sidebar-actions">
            <button class="chat-page__create-chat-btn" type="button">
              Создать чат
            </button>
            <a class="chat-page__profile-link" href="#">Профиль &rsaquo;</a>
          </div>
          {{SearchInput placeholder="Поиск" value=userSearchInput}}
        </header>
        <div class="chat-page__api-panel">
          {{#if chat.loading}}
            <p class="chat-page__api-status">Загрузка данных…</p>
          {{/if}}
          {{#if chat.error}}
            <p class="chat-page__api-status chat-page__api-status--error">{{chat.error}}</p>
          {{/if}}
          {{#if chat.demo}}
            <div class="chat-page__api-demo">
              <p class="chat-page__api-demo-label">Из store (ответ API):</p>
              <p class="chat-page__api-demo-row"><span>id</span> {{chat.demo.id}}</p>
              <p class="chat-page__api-demo-row"><span>title</span> {{chat.demo.title}}</p>
              <p class="chat-page__api-demo-body">{{chat.demo.body}}</p>
            </div>
          {{/if}}
        </div>
        <ul class="chat-page__contacts" role="list">
          {{#each users}}
            <li
              role="listitem"
              class="chat-page__contact-item{{#if isSearchResult}} chat-page__contact-item--search{{/if}}"
              {{#if isSearchResult}}
                data-user-id="{{id}}"
              {{else}}
                data-chat-id="{{id}}"
              {{/if}}
            >
              {{UserCard id=id name=name avatar=avatar lastMessage=lastMessage time=time unreadCount=unreadCount isOwn=isOwn active=active}}
            </li>
          {{/each}}
        </ul>
      </nav>

      <main class="chat-page__dialog">
        {{#if activeChat}}
          <header class="chat-page__dialog-header">
            <div class="chat-page__dialog-user">
              {{#if activeChat.avatar}}
                <div class="chat-page__dialog-avatar">
                  <img src="{{activeChat.avatar}}" alt="{{activeChat.name}}" />
                </div>
              {{/if}}
              {{#if activeChat.name}}
                <h1 class="chat-page__dialog-name">{{activeChat.name}}</h1>
              {{/if}}
            </div>
            {{#if activeChat.participantsCount}}
              <div class="chat-page__participants">
                <button
                  type="button"
                  class="chat-page__dialog-participants"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Участников: {{activeChat.participantsCount}}
                </button>
                {{#if activeChat.participants}}
                  <div class="chat-page__participants-popover" role="dialog" aria-label="Участники чата" hidden>
                    <ul class="chat-page__participants-list" role="list">
                      {{#each activeChat.participants}}
                        <li class="chat-page__participants-item">
                          <span class="chat-page__participants-name">{{name}}</span>
                          <span class="chat-page__participants-login">@{{login}}</span>
                          <span class="chat-page__participants-id">ID: {{id}}</span>
                        </li>
                      {{/each}}
                    </ul>
                  </div>
                {{/if}}
              </div>
            {{/if}}
            {{DropdownMenu items=menuItems onSelect=onMenuSelect}}
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
            <form class="chat-page__compose-form">
              {{DropdownMenu items=attachMenuItems onSelect=onAttachMenuSelect triggerStyle="attach" placement="above" align="left" ariaLabel="Прикрепить"}}
              <input
                class="chat-page__compose-input"
                type="text"
                name="message"
                placeholder="Сообщение"
                autocomplete="off"
              />
              <button class="chat-page__compose-send" type="submit" aria-label="Отправить">
                <img src="/arrow-back.svg" alt="" aria-hidden="true" />
              </button>
            </form>
          </footer>
        {{else}}
          <section class="chat-page__placeholder">
            <p>Выберите чат чтобы отправить сообщение</p>
          </section>
        {{/if}}
      </main>

      {{Modal
        ref="addUserModal"
        title="Добавить пользователя"
        fields=addUserFields
        submitLabel="Добавить"
        onSubmit=onAddUserSubmit
      }}

      {{Modal
        ref="removeUserModal"
        title="Удалить пользователя"
        fields=removeUserFields
        submitLabel="Удалить"
        onSubmit=onRemoveUserSubmit
      }}

      {{Modal
        ref="createChatModal"
        title="Введите название"
        fields=createChatFields
        submitLabel="Подтвердить"
        onSubmit=onCreateChatSubmit
      }}
    </div>
  `;
}

export default connect(mapChatPageToProps)(ChatPage as typeof Block);
