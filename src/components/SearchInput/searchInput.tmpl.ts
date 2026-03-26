import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';

interface SearchInputProps extends BlockOwnProps {
  placeholder?: string;
  name?: string;
  id?: string;
}

export default class SearchInput extends Block<SearchInputProps> {
  static componentName = 'SearchInput';

  protected template = `
    <div class="search-input">
      <input
        class="search-input__input"
        type="text"
        placeholder=" "
        {{#if name}}name="{{name}}"{{/if}}
        {{#if id}}id="{{id}}"{{/if}}
      />
      <span class="search-input__label">{{placeholder}}</span>
    </div>
  `;

  constructor(props = {} as SearchInputProps) {
    super({
      placeholder: 'Поиск',
      ...props,
    });
  }
}
