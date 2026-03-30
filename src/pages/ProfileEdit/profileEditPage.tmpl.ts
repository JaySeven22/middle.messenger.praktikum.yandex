import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';
import {
  validateForm,
  handleValidationFocus,
  handleValidationBlur,
} from '../../utils/validation';

interface ProfileEditPageProps extends BlockOwnProps {
  email?: string;
  login?: string;
  firstName?: string;
  secondName?: string;
  displayName?: string;
  phone?: string;
  onNavigate?: (page: string) => void;
}

export default class ProfileEditPage extends Block<ProfileEditPageProps> {
  static componentName = 'ProfileEditPage';

  protected template = `
    <div class="profile-page profile-edit-page">
      <nav class="profile-page__sidebar" aria-label="Навигация">
        <button ref="backButton" class="profile-page__back-btn" type="button" aria-label="Назад">
          <span class="profile-page__back-arrow">&lt;</span>
        </button>
      </nav>

      <main class="profile-page__content">
        <figure class="profile-page__avatar">
          {{Avatar}}
        </figure>

        <form class="profile-page__form" action="#" method="post">
          <div class="profile-edit-page__fields">
            {{Input label="Почта" name="email" value=email placeholder="pochta@yandex.ru"}}
            {{Input label="Логин" name="login" value=login placeholder="ivanivanov"}}
            {{Input label="Имя" name="first_name" value=firstName placeholder="Иван"}}
            {{Input label="Фамилия" name="second_name" value=secondName placeholder="Иванов"}}
            {{Input label="Имя в чате" name="display_name" value=displayName placeholder="Иван"}}
            {{Input label="Телефон" name="phone" value=phone type="tel" placeholder="+7 (909) 967 30 30"}}
          </div>

          <div class="profile-page__actions">
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
        console.log('Profile edit form:', data);
        this.props.onNavigate?.('profile');
      }
    },
    click: (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.profile-page__back-btn')) {
        this.props.onNavigate?.('profile');
      }
    },
    focusin: handleValidationFocus,
    focusout: handleValidationBlur,
  };
}
