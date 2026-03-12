// Handlebars-шаблон компонента SearchInput
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
    <span class="search-input__icon">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5 11.5L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/>
      </svg>
    </span>
    <span class="search-input__label">{{or placeholder "Поиск"}}</span>
  </div>
`;
