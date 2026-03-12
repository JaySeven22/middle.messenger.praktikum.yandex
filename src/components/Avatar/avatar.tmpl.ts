// src — URL картинки (опционально, без неё будет серый круг)
// name — имя под аватаром (опционально)
// width / height — размер (по умолчанию 130px)
// disabled — если true, оверлей при наведении не показывается
export const avatarTemplate = `
  <div>
    <div class="avatar {{#unless disabled}}avatar--interactive{{/unless}}"
      style="width: {{or width "130"}}px; height: {{or height "130"}}px;"
    >
      {{#if src}}
        <img class="avatar__image" src="{{src}}" alt="{{or name "avatar"}}" />
      {{else}}
        <div class="avatar__placeholder" ></div>
      {{/if}}

      {{#unless disabled}}
        <div class="avatar__overlay">
          <span class="avatar__overlay-text">Поменять<br>аватар</span>
        </div>
      {{/unless}}
    </div>
    
    {{#if name}}
      <span class="avatar__name">{{name}}</span>
    {{/if}}
  </div>
`;

