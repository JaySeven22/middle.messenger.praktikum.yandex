import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';

interface UserCardProps extends BlockOwnProps {
  id?: number;
  name?: string;
  avatar?: string;
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
  isOwn?: boolean;
  active?: boolean;
}

export default class UserCard extends Block<UserCardProps> {
  static componentName = 'UserCard';

  protected template = `
    <article class="user-card {{#if active}}user-card--active{{/if}}">
      <div class="user-card__avatar">
        {{#if avatar}}
          <img src="{{avatar}}" alt="{{name}}" class="user-card__avatar-img" />
        {{else}}
          <span class="user-card__avatar-letter" aria-hidden="true">{{firstLetter name}}</span>
        {{/if}}
      </div>

      <div class="user-card__content">
        <div class="user-card__row">
          <h3 class="user-card__name">{{name}}</h3>
          <time class="user-card__time">{{time}}</time>
        </div>
        <div class="user-card__row">
          <p class="user-card__message">
            {{#if isOwn}}<span class="user-card__message-own">Вы: </span>{{/if}}{{lastMessage}}{{#if id}}<span class="user-card__message-id" aria-label="Идентификатор"> · id: {{id}}</span>{{/if}}
          </p>
          {{#if (gt unreadCount 0)}}
            <span class="user-card__badge" aria-label="{{unreadCount}} непрочитанных">{{unreadCount}}</span>
          {{/if}}
        </div>
      </div>
    </article>
  `;
}
