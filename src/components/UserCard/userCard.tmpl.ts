// Handlebars-шаблон компонента UserCard
// Используется как partial {{> userCard}}
export const userCardTemplate = `
  <div class="user-card">
    <div class="user-card__avatar">
      {{#if avatar}}
        <img src="{{avatar}}" alt="{{name}}" class="user-card__avatar-img" />
      {{else}}
        <span class="user-card__avatar-letter">{{firstLetter name}}</span>
      {{/if}}
    </div>

    <div class="user-card__info">
      <div class="user-card__header">
        <span class="user-card__name">{{name}}</span>
        <span class="user-card__status {{#if (eq status "online")}}user-card__status--online{{else}}user-card__status--offline{{/if}}">
          {{#if (eq status "online")}}онлайн{{else}}оффлайн{{/if}}
        </span>
      </div>

      {{#if lastMessage}}
        <p class="user-card__message">{{lastMessage}}</p>
      {{/if}}
    </div>

    {{#if (gt unreadCount 0)}}
      <span class="user-card__badge">{{unreadCount}}</span>
    {{/if}}
  </div>
`;
