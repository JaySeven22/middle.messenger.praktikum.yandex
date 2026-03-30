import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';

interface InputProps extends BlockOwnProps {
  label?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  error?: string;
}

export default class Input extends Block<InputProps> {
  static componentName = 'Input';

  protected template = `
    <div class="input-field {{#if error}}input-field--error{{/if}}">
      <label class="input-field__label">{{label}}</label>
      <input
        class="input-field__input"
        {{#if name}}name="{{name}}"{{/if}}
        type="{{type}}"
        {{#if placeholder}}placeholder="{{placeholder}}"{{/if}}
        {{#if value}}value="{{value}}"{{/if}}
      />
      {{#if error}}
        <span class="input-field__error">{{error}}</span>
      {{/if}}
    </div>
  `;

  constructor(props = {} as InputProps) {
    super({
      type: 'text',
      ...props,
    });
  }
}
