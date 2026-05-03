import Block from '../../framework/block';
import ProfilePageAPI from './profile.api';
import LoginPageAPI from '../Login/login.api';
import connect from '../../utils/connectToStore';
import store from '../../framework/store';
import type { Indexed } from '../../utils/merge';
import { mapUserToProps } from '../../composables/User';
import { clearAuthUser } from '../../framework/authRouting';
import type { ProfilePageProps } from '../../entities/Profile';

class ProfilePage extends Block<ProfilePageProps> {
  static componentName = 'ProfilePage';

  private loginAPI = new LoginPageAPI();
  private profileAPI = new ProfilePageAPI();

  protected template = `
    <div class="profile-page">
      <nav class="profile-page__sidebar" aria-label="Навигация">
        <button class="profile-page__back-btn" type="button" aria-label="Назад">
          <img class="profile-page__back-arrow" src="/arrow-back.svg" alt="" aria-hidden="true" />
        </button>
      </nav>

      <main class="profile-page__content">
        <figure class="profile-page__avatar">
          {{Avatar src=avatar}}
        </figure>

        <h2 class="profile-page__username">{{displayName}}</h2>

        <div class="profile-page__fields">
          <div class="profile-page__row">
            <span class="profile-page__label">Почта</span>
            <span class="profile-page__value">{{email}}</span>
          </div>
          <div class="profile-page__row">
            <span class="profile-page__label">Логин</span>
            <span class="profile-page__value">{{login}}</span>
          </div>
          <div class="profile-page__row">
            <span class="profile-page__label">Имя</span>
            <span class="profile-page__value">{{firstName}}</span>
          </div>
          <div class="profile-page__row">
            <span class="profile-page__label">Фамилия</span>
            <span class="profile-page__value">{{secondName}}</span>
          </div>
          <div class="profile-page__row">
            <span class="profile-page__label">Имя в чате</span>
            <span class="profile-page__value">{{displayName}}</span>
          </div>
          <div class="profile-page__row">
            <span class="profile-page__label">Телефон</span>
            <span class="profile-page__value">{{phone}}</span>
          </div>
        </div>

        <div class="profile-page__actions">
          <button class="profile-page__action-link" type="button" data-action="edit-profile">
            Изменить данные
          </button>
          <button class="profile-page__action-link" type="button" data-action="edit-password">
            Изменить пароль
          </button>
          <button
            class="profile-page__action-link profile-page__action-link--danger"
            type="button"
            data-action="logout"
          >
            Выйти
          </button>
        </div>
      </main>
    </div>
  `;

  protected componentDidMount(): void {
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
    click: (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.closest('.profile-page__back-btn')) {
        this.props.onNavigate?.('messenger');
        return;
      }

      const actionButton = target.closest<HTMLButtonElement>('[data-action]');
      const action = actionButton?.dataset.action;

      if (action === 'edit-profile') {
        this.props.onNavigate?.('settingsEdit');
      }

      if (action === 'edit-password') {
        this.props.onNavigate?.('passwordEdit');
      }

      if (action === 'logout') {
        this.profileAPI.logout()
          .then(() => {
            clearAuthUser();
            this.props.onNavigate?.('');
          })
          .catch((err) => {
            window.alert('Произошла ошибка при выходе из аккаунта');
            console.log(err);
          });
      }
    },
  };
}

export default connect(mapUserToProps)(ProfilePage as typeof Block);
