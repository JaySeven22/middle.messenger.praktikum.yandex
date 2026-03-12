// error — текст ошибки, при наличии поле окрашивается в красный
export const inputTemplate = `
  <div class="input-field {{#if error}}input-field--error{{/if}}">
    <label class="input-field__label" {{#if id}}for="{{id}}"{{/if}}>
      {{label}}
    </label>
    <input
      class="input-field__input"
      {{#if id}}id="{{id}}"{{/if}}
      {{#if name}}name="{{name}}"{{/if}}
      type="{{or type "text"}}"
      {{#if placeholder}}placeholder="{{placeholder}}"{{/if}}
      {{#if value}}value="{{value}}"{{/if}}
    />
    {{#if error}}
      <span class="input-field__error">{{error}}</span>
    {{/if}}
  </div>
`;
