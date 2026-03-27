import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';
import {
  validateForm,
  handleValidationFocus,
  handleValidationBlur,
} from '../../utils/validation';

interface RegisterPageProps extends BlockOwnProps {
  onNavigate?: (page: string) => void;
}

export default class RegisterPage extends Block<RegisterPageProps> {
  static componentName = 'RegisterPage';

  protected template = `
    <main class="register-page">
      <section class="card card--wide">
        <form class="register-page__form" action="#" method="post">
          <h1 class="register-page__title">Регистрация</h1>
          <div class="register-page__fields">
            {{Input label="Почта" placeholder="pochta@yandex.ru" name="email"}}
            {{Input label="Логин" placeholder="ivanivanov" name="login"}}
            {{Input label="Имя" placeholder="Иван" name="first_name"}}
            {{Input label="Фамилия" placeholder="Иванов" name="second_name"}}
            {{Input label="Телефон" placeholder="+7 (909) 967 30 30" name="phone" type="tel"}}
            {{Input label="Пароль" placeholder="Введите пароль" name="password" type="password"}}
            {{Input label="Пароль (ещё раз)" placeholder="Повторите пароль" name="password_confirm" type="password"}}
          </div>
          <div class="register-page__actions">
            {{Button label="Зарегистрироваться" variant="filled" type="submit"}}
            {{Button label="Войти" variant="link" ref="loginButton"}}
          </div>
        </form>
      </section>
    </main>
  `;

  protected events = {
    submit: (e: Event) => {
      e.preventDefault();
      const { isValid, data } = validateForm(e.target as HTMLFormElement);
      if (isValid) {
        console.log('Register form:', data);
        this.props.onNavigate?.('');
      }
    },
    click: (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.button--link')) {
        this.props.onNavigate?.('');
      }
    },
    focusin: handleValidationFocus,
    focusout: handleValidationBlur,
  };
}
