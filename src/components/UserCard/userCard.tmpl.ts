export const userCardTemplate = `
  <div class="user-card {{#if active}}user-card--active{{/if}}">
    <div class="user-card__avatar">
      {{#if avatar}}
        <img src="{{avatar}}" alt="{{name}}" class="user-card__avatar-img" />
      {{else}}
        <span class="user-card__avatar-letter">{{firstLetter name}}</span>
      {{/if}}
    </div>

    <div class="user-card__content">
      <div class="user-card__row">
        <span class="user-card__name">{{name}}</span>
        <span class="user-card__time">{{time}}</span>
      </div>
      <div class="user-card__row">
        <p class="user-card__message">{{#if isOwn}}<span class="user-card__message-own">Вы: </span>{{/if}}{{lastMessage}}</p>
        {{#if (gt unreadCount 0)}}
          <span class="user-card__badge">{{unreadCount}}</span>
        {{/if}}
      </div>
    </div>
  </div>
`;
