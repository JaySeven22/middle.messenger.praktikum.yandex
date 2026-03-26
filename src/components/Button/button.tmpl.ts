// Варианты: "filled" (закрашенная) и "link" (без фона, только текст)
export const buttonTemplate = `
  <button
    class="button button--{{or variant "filled"}}"
    {{#if id}}id="{{id}}"{{/if}}
    type="{{or type "button"}}"
  >
    {{or label "Принять"}}
  </button>
`;
