import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';
import { validateForm, attachBlurValidation } from '../../utils/validation';

interface LoginPageProps extends BlockOwnProps {
  onNavigate?: (page: string) => void;
}

export default class LoginPage extends Block<LoginPageProps> {
  static componentName = 'LoginPage';

  protected template = `
    <main class="login-page">
      <section class="card">
        <form class="login-page__form" action="#" method="post">
          <h1 class="login-page__title">Вход</h1>
          <div class="login-page__fields">
            {{Input label="Логин" placeholder="ivanivanov" name="login"}}
            {{Input label="Пароль" placeholder="Введите пароль" name="password" type="password"}}
          </div>
          <div class="login-page__actions">
            {{Button label="Авторизоваться" variant="filled" type="submit"}}
            {{Button label="Нет аккаунта?" variant="link" ref="registerButton"}}
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
        console.log('Login form:', data);
        this.props.onNavigate?.('chat');
      }
    },
  };

  protected componentDidMount() {
    const el = this.element();
    if (el) attachBlurValidation(el);

    this.refs.registerButton?.addEventListener('click', () => {
      this.props.onNavigate?.('register');
    });
  }
}
