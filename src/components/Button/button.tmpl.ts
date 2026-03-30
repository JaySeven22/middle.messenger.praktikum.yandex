import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';

interface ButtonProps extends BlockOwnProps {
  label?: string;
  variant?: string;
  type?: string;
}

export default class Button extends Block<ButtonProps> {
  static componentName = 'Button';

  protected template = `
    <button class="button button--{{variant}}" type="{{type}}">
      {{label}}
    </button>
  `;

  constructor(props = {} as ButtonProps) {
    super({
      label: 'Принять',
      variant: 'filled',
      type: 'button',
      ...props,
    });
  }
}
