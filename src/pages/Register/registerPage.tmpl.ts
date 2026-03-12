export const registerPageTemplate = `
<main class="register-page">
  {{#> card className="card--wide"}}
    <form class="register-page__form" action="#" method="post">
      <h1 class="register-page__title">Регистрация</h1>
      <div class="register-page__fields">
        {{> input label="Почта" placeholder="pochta@yandex.ru" name="email"}}
        {{> input label="Логин" placeholder="ivanivanov" name="login"}}
        {{> input label="Имя" placeholder="Иван" name="first_name"}}
        {{> input label="Фамилия" placeholder="Иванов" name="second_name"}}
        {{> input label="Телефон" placeholder="+7 (909) 967 30 30" name="phone" type="tel"}}
        {{> input label="Пароль" placeholder="Введите пароль" name="password" type="password"}}
        {{> input label="Пароль (ещё раз)" placeholder="Повторите пароль" name="password_confirm" type="password" error=passwordError}}
      </div>
      <div class="register-page__actions">
        {{> button id="register-submit" label="Зарегистрироваться" variant="filled" type="submit"}}
        {{> button id="login-button" label="Войти" variant="link"}}
      </div>
    </form>
  {{/card}}
</main>
`;
