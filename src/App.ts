import Handlebars from 'handlebars';
import * as Pages from './pages';
import './style.scss';
import './components/UserCard/userCard.scss';
import './components/Button/button.scss';
import './components/Input/input.scss';
import './components/Avatar/avatar.scss';
import './components/SearchInput/searchInput.scss';
import './pages/ErrorPage/errorPage.scss';
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
                template = Handlebars.compile(Pages.ErrorPage);
                this.appElement.innerHTML = template({
                    code: 404,
                    message: 'Не туда попали',
                    linkText: 'Назад к чатам',
                    linkHref: '/',
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
        if (this.state.currentPage === '') {
            const registerButton = document.getElementById('register-button');
            const autorizeButton = document.getElementById('login-button');
            
            registerButton?.addEventListener('click', () => this.changePage('register'));
            autorizeButton?.addEventListener('click', () => this.changePage('chat'));
        }
    }

    changePage(page: string) {
        this.state.currentPage = page;
        const path = page ? `/${page}` : '/';
        window.history.pushState({ page }, '', path);
        this.render();
    }
}