import Block from '../../framework/block';
import { handleValidationBlur, handleValidationFocus, validateForm } from '../../utils/validation';
import PasswordEditPageAPI from './passwordEdit.api';
import connect from '../../utils/connectToStore';
import store from '../../framework/store';
import type { Indexed } from '../../utils/merge';
import { mapUserToProps } from '../../composables/User';
import LoginPageAPI from '../Login/login.api';
import type { PasswordEditFormData, PasswordEditPageProps } from '../../entities/Auth';

class PasswordEditPage extends Block<PasswordEditPageProps> {
  static componentName = 'PasswordEditPage';

  private passwordEditApi = new PasswordEditPageAPI();
  private loginAPI = new LoginPageAPI();

  protected template = `
    <div class="profile-page password-edit-page">
      <nav class="profile-page__sidebar" aria-label="Навигация">
        <button ref="backButton" class="password-edit-page__back-btn" type="button" aria-label="Назад">
          <img class="profile-page__back-arrow" src="/arrow-back.svg" alt="" aria-hidden="true" />
        </button>
      </nav>

      <main class="profile-page__content">
        <figure class="profile-page__avatar">
          {{Avatar src=avatar}}
        </figure>

        <form class="profile-page__form" action="#" method="post">
          <div class="password-edit-page__fields">
            {{Input label="Старый пароль" name="oldPassword" type="password" value=oldPassword placeholder="Введите старый пароль"}}
            {{Input label="Новый пароль" name="newPassword" type="password" value=newPassword placeholder="Введите новый пароль"}}
            {{Input label="Повторите новый пароль" name="password_confirm" type="password" value=repeatNewPassword placeholder="Повторите новый пароль"}}
          </div>

          <div class="password-edit-page__actions">
            {{Button label="Сохранить" variant="filled" type="submit"}}
          </div>
        </form>
      </main>
    </div>
  `;

  protected componentDidMount(): void {
    if (store.getState().user) return;

    this.loginAPI.authUser()
      .then((data) => {
        if (data && typeof data === 'object') {
          store.setState('user', data as Indexed);
        }
      })
      .catch((err) => {
        window.alert('Произошла ошибка при получении данных пользователя');
        console.log('err', err);
      });
  }

  protected events = {
    submit: (e: Event) => {
      e.preventDefault();
      const { isValid, data } = validateForm(e.target as HTMLFormElement);
      if (isValid) {
        const passwordEditFormData: PasswordEditFormData = {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        };
        this.passwordEditApi.chamgePassword(passwordEditFormData)
        .then(() => {
          this.props.onNavigate?.('settings');
        })
        .catch((err) => {
          window.alert('Произошла ошибка при изменении пароля');
          console.log(err);
        });
      }
    },
    click: (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.password-edit-page__back-btn')) {
        this.props.onNavigate?.('settings');
      }
    },
    focusin: handleValidationFocus,
    focusout: handleValidationBlur,
  };
}

export default connect(mapUserToProps)(PasswordEditPage as typeof Block);
