export const chatPageTemplate = `
<div class="chat-page">
  <nav class="chat-page__sidebar" aria-label="Список чатов">
    <header class="chat-page__sidebar-header">
      <a id="profile-link" class="chat-page__profile-link" href="#">Профиль &rsaquo;</a>
      {{> searchInput placeholder="Поиск"}}
    </header>
    <ul class="chat-page__contacts" role="list">
      {{#each users}}
        <li role="listitem">
          {{> userCard name=name lastMessage=lastMessage time=time unreadCount=unreadCount isOwn=isOwn active=active}}
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
    {{else}}
      <section class="chat-page__placeholder">
        <p>Выберите чат чтобы отправить сообщение</p>
      </section>
    {{/if}}
  </main>
</div>
`;
