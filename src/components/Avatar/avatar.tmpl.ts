import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';

interface AvatarProps extends BlockOwnProps {
  src?: string;
  name?: string;
  size?: string;
  disabled?: boolean;
}

export default class Avatar extends Block<AvatarProps> {
  static componentName = 'Avatar';

  protected template = `
    <div>
      <div class="avatar {{#if size}}avatar--{{size}}{{/if}} {{#unless disabled}}avatar--interactive{{/unless}}">
        {{#if src}}
          <img class="avatar__image" src="{{src}}" alt="{{or name "avatar"}}" />
        {{else}}
          <div class="avatar__placeholder"></div>
        {{/if}}
        {{#unless disabled}}
          <div class="avatar__overlay">
            <p class="avatar__overlay-text">Поменять</p>
            <p class="avatar__overlay-text">аватар</p>
          </div>
        {{/unless}}
      </div>
      {{#if name}}
        <span class="avatar__name">{{name}}</span>
      {{/if}}
    </div>
  `;
}
