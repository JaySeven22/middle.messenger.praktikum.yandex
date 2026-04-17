import './style.scss';
import './components/Button/button.scss';
import './components/Input/input.scss';
import './components/Card/card.scss';
import './components/Avatar/avatar.scss';
import './components/UserCard/userCard.scss';
import './components/SearchInput/searchInput.scss';
import './pages/Login/loginPage.scss';
import './pages/Register/registerPage.scss';
import './pages/Chat/chat.scss';
import './pages/Profile/profilePage.scss';
import './pages/ProfileEdit/profileEditPage.scss';
import './pages/ErrorPage/errorPage.scss';
import './pages/PasswordEdit/passwordEditPage.scss';

import './framework/helpers';

import './components/Button';
import './components/Input';
import './components/Avatar';
import './components/UserCard';
import './components/SearchInput';

import { initRouter } from './App';

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
});
