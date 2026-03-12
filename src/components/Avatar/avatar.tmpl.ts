// src — URL картинки (опционально, без неё будет серый круг)
// name — имя под аватаром (опционально)
// size — модификатор размера (опционально, например "sm")
// disabled — если true, оверлей при наведении не показывается
export const avatarTemplate = `
  <div>
    <div class="avatar {{#if size}}avatar--{{size}}{{/if}} {{#if disabled}}{{else}}avatar--interactive{{/if}}">
      {{#if src}}
        <img class="avatar__image" src="{{src}}" alt="{{or name "avatar"}}" />
      {{else}}
        <div class="avatar__placeholder"></div>
      {{/if}}

      {{#if disabled}}
      {{else}}
        <div class="avatar__overlay">
          <p class="avatar__overlay-text">Поменять</p>
          <p class="avatar__overlay-text">аватар</p>
        </div>
      {{/if}}
    </div>
    
    {{#if name}}
      <span class="avatar__name">{{name}}</span>
    {{/if}}
  </div>
`;

