// Варианты: "filled" (закрашенная) и "link" (без фона, только текст)
export const buttonTemplate = `
  <button
    class="button button--{{or variant "filled"}}"
    style="width: {{or width "100%"}}; height: {{or height "auto"}}; {{#if (eq (or variant "filled") "filled")}}background-color: {{or color "#3369F3"}};{{/if}} {{#if textColor}}color: {{textColor}};{{/if}}"
    {{#if id}}id="{{id}}"{{/if}}
    type="{{or type "button"}}"
  >
    {{or label "Принять"}}
  </button>
`;
