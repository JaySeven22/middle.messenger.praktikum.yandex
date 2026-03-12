export const loginPageTemplate = `
<main class="login-page">
  {{#> card}}
    <form class="login-page__form" action="#" method="post">
      <h1 class="login-page__title">Вход</h1>
      <div class="login-page__fields">
        {{> input label="Логин" placeholder="ivanivanov" name="login"}}
        {{> input label="Пароль" placeholder="Введите пароль" name="password" type="password"}}
      </div>
      <div class="login-page__actions">
        {{> button id="login-button" label="Авторизоваться" variant="filled" type="submit"}}
        {{> button id="register-button" label="Нет аккаунта?" variant="link"}}
      </div>
    </form>
  {{/card}}
</main>
`;
