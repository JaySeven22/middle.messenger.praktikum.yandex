export const errorPageTemplate = `
<div class="error-page">
  <div class="error-page__card">
    <h1 class="error-page__code">{{code}}</h1>
    <p class="error-page__message">{{message}}</p>
    <a class="error-page__link" href="{{or linkHref "#"}}">
      {{or linkText "Назад к чатам"}}
    </a>
  </div>
</div>
`;
