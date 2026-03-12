export const loginPageTemplate = `
<div class="login-page">
  {{#> card}}
    <h2 style="text-align: center; margin: 0 0 24px;">Вход</h2>
    {{> input label="Логин" placeholder="ivanivanov" name="login"}}
    {{> input label="Пароль" placeholder="Введите пароль" name="password" type="password"}}
    <div style="margin-top: auto; display: flex; flex-direction: column; align-items: center; gap: 12px;">
      {{> button id="login-button" label="Авторизоваться" variant="filled" height="40px"}}
      {{> button id="register-button" label="Нет аккаунта?" variant="link" height="40px"}}
    </div>
  {{/card}}
</div>
`;
