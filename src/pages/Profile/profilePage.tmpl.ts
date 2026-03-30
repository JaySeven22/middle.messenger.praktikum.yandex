import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';

interface ProfilePageProps extends BlockOwnProps {
  email?: string;
  login?: string;
  firstName?: string;
  secondName?: string;
  displayName?: string;
  phone?: string;
  onNavigate?: (page: string) => void;
}

export default class ProfilePage extends Block<ProfilePageProps> {
  static componentName = 'ProfilePage';

  protected template = `
    <div class="profile-page">
      <nav class="profile-page__sidebar" aria-label="Навигация">
        <button class="profile-page__back-btn" type="button" aria-label="Назад">
          <span class="profile-page__back-arrow">&lt;</span>
        </button>
      </nav>

      <main class="profile-page__content">
        <figure class="profile-page__avatar">
          {{Avatar}}
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

  protected events = {
    click: (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.closest('.profile-page__back-btn')) {
        this.props.onNavigate?.('chat');
        return;
      }

      const actionButton = target.closest<HTMLButtonElement>('[data-action]');
      const action = actionButton?.dataset.action;

      if (action === 'edit-profile') {
        this.props.onNavigate?.('profileEdit');
      }

      if (action === 'edit-password') {
        this.props.onNavigate?.('passwordEdit');
      }

      if (action === 'logout') {
        this.props.onNavigate?.('');
      }
    },
  };
}
