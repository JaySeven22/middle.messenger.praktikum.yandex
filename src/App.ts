import Handlebars from 'handlebars';
import * as Pages from './pages';
import './style.scss';
import './components/UserCard/userCard.scss';
import './components/Button/button.scss';
import './components/Input/input.scss';
import './components/Avatar/avatar.scss';
import './components/SearchInput/searchInput.scss';
import './pages/Login/loginPage.scss';
import './pages/ErrorPage/errorPage.scss';
import './pages/Register/registerPage.scss';
import './pages/Chat/chat.scss';
import './pages/Profile/profilePage.scss';
import './components/Card/card.scss';

// Импорт регистрирует partial
import './components/UserCard';
import './components/Button';
import './components/Input';
import './components/Avatar';
import './components/SearchInput';
import './components/Card';

export default class App {
    state: { currentPage: string };
    appElement: HTMLElement;

    constructor() {
        this.state = {
            currentPage: '',
        };
        this.appElement = document.getElementById('app')!;
    }

    render() {
        let template;

        switch (this.state.currentPage) {
            case '':
                template = Handlebars.compile(Pages.LoginPage);
                this.appElement.innerHTML = template({});
                break;
            case 'register':
                template = Handlebars.compile(Pages.RegisterPage);
                this.appElement.innerHTML = template({});
                break;
            case 'chat':
                template = Handlebars.compile(Pages.ChatPage);
                this.appElement.innerHTML = template({
                    users: [
                        { name: 'Марина Кузнецова', lastMessage: 'lorem ipsum dolor sit amet lorem ipsum dolor sit amet', time: '09:23', unreadCount: 1 },
                        { name: 'Тимур Бобров', lastMessage: 'lorem ipsum dolor sit amet lorem ipsum dolor sit amet', time: '08:45', unreadCount: 3 },
                        { name: 'Олег Петров', lastMessage: 'lorem ipsum dolor sit amet lorem ipsum dolor sit amet', time: 'Вчера', isOwn: true, active: true },
                    ],
                    activeChat: {
                        name: 'Олег Петров',
                        messages: [
                            { dateSeparator: '5 марта' },
                            { text: 'lorem ipsum dolor sit amet lorem ipsum dolor sit amet', time: '14:20' },
                            { text: 'lorem ipsum dolor sit amet lorem ipsum dolor sit amet', time: '14:22' },
                        ],
                    },
                });
                break;
            case 'profile':
                template = Handlebars.compile(Pages.ProfilePage);
                this.appElement.innerHTML = template({
                    email: 'pochta@yandex.ru',
                    login: 'ivanivanov',
                    firstName: 'Иван',
                    secondName: 'Иванов',
                    displayName: 'Иван',
                    phone: '+7 (909) 967 30 30',
                });
                break;
            default:
                template = Handlebars.compile(Pages.ErrorPage);
                this.appElement.innerHTML = template({
                    code: 404,
                    message: 'Не туда попали',
                    linkText: 'Назад к чатам',
                    linkHref: '/',
                });
                break;
        }
        this.attachEventListeners();
    }

    attachEventListeners() {
        const loginButton = document.getElementById('login-button');
        const registerButton = document.getElementById('register-button');

        if (this.state.currentPage === '') {
            registerButton?.addEventListener('click', () => this.changePage('register'));
            loginButton?.addEventListener('click', () => this.changePage('chat'));
        }

        if (this.state.currentPage === 'register') {
            const registerSubmit = document.getElementById('register-submit');
            loginButton?.addEventListener('click', () => this.changePage(''));
            registerSubmit?.addEventListener('click', () => this.changePage(''));
        }

        if (this.state.currentPage === 'chat') {
            const profileLink = document.getElementById('profile-link');
            profileLink?.addEventListener('click', (e) => {
                e.preventDefault();
                this.changePage('profile');
            });
        }

        if (this.state.currentPage === 'profile') {
            const backBtn = document.getElementById('profile-back');
            const submitButton = document.getElementById('profile-save');
            backBtn?.addEventListener('click', () => this.changePage('chat'));
            submitButton?.addEventListener('click', () => this.changePage('chat'));
        }
    }

    changePage(page: string) {
        this.state.currentPage = page;
        const path = page ? `/${page}` : '/';
        window.history.pushState({ page }, '', path);
        this.render();
    }
}
