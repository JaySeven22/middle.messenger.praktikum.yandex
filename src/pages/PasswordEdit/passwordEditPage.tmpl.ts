import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';
import { handleValidationBlur, handleValidationFocus, validateForm } from '../../utils/validation';

interface PasswordEditPageProps extends BlockOwnProps {
  passwordOld?: string;
  passwordNew?: string;
  passwordNewRepeat?: string;
  displayName?: string;
  onNavigate?: (page: string) => void;
}

export default class ProfilePage extends Block<PasswordEditPageProps> {
  static componentName = 'PasswordEditPage';

  protected template = `
    <div class="profile-page password-edit-page">
      <nav class="profile-page__sidebar" aria-label="Навигация">
        <button ref="backButton" class="password-edit-page__back-btn" type="button" aria-label="Назад">
          <span class="profile-page__back-arrow">&lt;</span>
        </button>
      </nav>

      <main class="profile-page__content">
        <figure class="profile-page__avatar">
          {{Avatar}}
        </figure>

        <form class="profile-page__form" action="#" method="post">
          <div class="password-edit-page__fields">
            {{Input label="Старый пароль" name="old_password" type="password" value=passwordOld placeholder="Введите старый пароль"}}
            {{Input label="Новый пароль" name="password" type="password" value=passwordNew placeholder="Введите новый пароль"}}
            {{Input label="Повторите новый пароль" name="password_confirm" type="password" value=passwordNewRepeat placeholder="Повторите новый пароль"}}
          </div>

          <div class="password-edit-page__actions">
            {{Button label="Сохранить" variant="filled" type="submit"}}
          </div>
        </form>
      </main>
    </div>
  `;

  protected events = {
    submit: (e: Event) => {
      e.preventDefault();
      const { isValid, data } = validateForm(e.target as HTMLFormElement);
      if (isValid) {
        console.log('Password edit form:', data);
        this.props.onNavigate?.('profile');
      }
    },
    click: (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.password-edit-page__back-btn')) {
        this.props.onNavigate?.('profile');
      }
    },
    focusin: handleValidationFocus,
    focusout: handleValidationBlur,
  };
}
