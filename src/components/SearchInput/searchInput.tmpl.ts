// placeholder — текст подсказки (по умолчанию "Поиск")
// name — атрибут name инпута
// id — атрибут id инпута
export const searchInputTemplate = `
  <div class="search-input">
    <input
      class="search-input__input"
      type="text"
      placeholder=" "
      {{#if name}}name="{{name}}"{{/if}}
      {{#if id}}id="{{id}}"{{/if}}
    />
    <span class="search-input__label">{{or placeholder "Поиск"}}</span>
  </div>
`;
