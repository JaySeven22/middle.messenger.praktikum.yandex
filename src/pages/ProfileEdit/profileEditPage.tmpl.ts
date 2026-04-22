import Block from '../../framework/block';
import {
  validateForm,
  handleValidationFocus,
  handleValidationBlur,
} from '../../utils/validation';
import LoginPageAPI from '../Login/login.api';
import ProfileEditPageAPI from './profileEdit.api';
import connect from '../../utils/connectToStore';
import store from '../../framework/store';
import type { Indexed } from '../../utils/merge';
import { mapUserToProps } from '../../composables/User';
import type { UserData } from '../../entities/User';
import type { ProfileEditPageProps } from '../../entities/Profile';

class ProfileEditPage extends Block<ProfileEditPageProps> {
  static componentName = 'ProfileEditPage';

  private loginAPI = new LoginPageAPI();
  private profileEditAPI = new ProfileEditPageAPI();

  constructor(props = {} as ProfileEditPageProps) {
    super(props);
    this.props.onAvatarSubmit ??= this.handleAvatarSubmit;
  }

  private handleAvatarSubmit = (file: File): Promise<unknown> => {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.profileEditAPI.changeUserAvatar(formData).then((data) => {
      if (data && typeof data === 'object') {
        store.setState('user', data as Indexed);
      }
      return data;
    });
  };

  private openModal(refName: string): void {
    const modalEl = this.refs[refName];
    if (modalEl instanceof HTMLElement) {
      modalEl.classList.add('modal--open');
    }
  }

  protected template = `
    <div class="profile-page profile-edit-page">
      <nav class="profile-page__sidebar" aria-label="Навигация">
        <button ref="backButton" class="profile-page__back-btn" type="button" aria-label="Назад">
          <img class="profile-page__back-arrow" src="/arrow-back.svg" alt="" aria-hidden="true" />
        </button>
      </nav>

      <main class="profile-page__content">
        <figure class="profile-page__avatar">
          {{Avatar src=avatar}}
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

      {{Modal
        ref="uploadAvatarModal"
        title="Загрузите файл"
        isFileUpload=true
        fileFieldName="avatar"
        fileAccept="image/*"
        filePickLabel="Выбрать файл на компьютере"
        submitLabel="Поменять"
        onFileSubmit=onAvatarSubmit
      }}
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
      const form = e.target as HTMLFormElement;
      if (!form.classList.contains('profile-page__form')) return;
      e.preventDefault();
      const { isValid, data } = validateForm(form);
      if (!isValid) return;

      this.profileEditAPI.changeUserProfile(data as unknown as UserData)
        .then((response) => {
          const updated = response && typeof response === 'object'
            ? response
            : { ...data };
          store.setState('user', updated as Indexed);
          this.props.onNavigate?.('profile');
        })
        .catch((err) => {
          window.alert('Произошла ошибка при изменении данных пользователя');
          console.log('err', err);
        });
    },
    click: (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.profile-page__back-btn')) {
        this.props.onNavigate?.('profile');
        return;
      }
      if (target.closest('.avatar--interactive')) {
        e.preventDefault();
        this.openModal('uploadAvatarModal');
      }
    },
    focusin: handleValidationFocus,
    focusout: handleValidationBlur,
  };
}

export default connect(mapUserToProps)(ProfileEditPage as typeof Block);
