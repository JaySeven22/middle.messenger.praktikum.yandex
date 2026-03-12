export const cardTemplate = `
  <div
    class="card {{className}}"
    style="width: {{or width "340px"}}; {{style}}"
  >
    {{> @partial-block}}
  </div>
`;
