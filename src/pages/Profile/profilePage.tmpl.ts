export const profilePageTemplate = `
<div class="profile-page">
  <nav class="profile-page__sidebar" aria-label="Навигация">
    <button id="profile-back" class="profile-page__back-btn" type="button" aria-label="Назад">
      <span class="profile-page__back-arrow"><</span>
    </button>
  </nav>

  <main class="profile-page__content">

    <figure class="profile-page__avatar">
      {{> avatar}}
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
        {{> button id="profile-save" label="Сохранить" variant="filled" type="submit"}}
      </div>
    </form>
  </main>
</div>
`;
