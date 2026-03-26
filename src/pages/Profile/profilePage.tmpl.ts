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
        <button ref="backButton" class="profile-page__back-btn" type="button" aria-label="Назад">
          <span class="profile-page__back-arrow">&lt;</span>
        </button>
      </nav>

      <main class="profile-page__content">
        <figure class="profile-page__avatar">
          {{Avatar}}
        </figure>

        <form class="profile-page__form" action="#" method="post">
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
            {{Button label="Сохранить" variant="filled" type="submit"}}
          </div>
        </form>
      </main>
    </div>
  `;

  protected events = {
    submit: (e: Event) => {
      e.preventDefault();
      const { onNavigate: _, __children: _c, __refs: _r, ...profileData } = this.props;
      console.log('Profile form:', profileData);
      this.props.onNavigate?.('chat');
    },
  };

  protected componentDidMount() {
    this.refs.backButton?.addEventListener('click', () => {
      this.props.onNavigate?.('chat');
    });
  }
}
