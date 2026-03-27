import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';

interface ErrorPageProps extends BlockOwnProps {
  code?: number;
  message?: string;
  linkText?: string;
  linkHref?: string;
  onNavigate?: (page: string) => void;
}

export default class ErrorPage extends Block<ErrorPageProps> {
  static componentName = 'ErrorPage';

  protected template = `
    <main class="error-page">
      <section class="error-page__card">
        <h1 class="error-page__code">{{code}}</h1>
        <p class="error-page__message">{{message}}</p>
        <a class="error-page__link" href="#">
          {{or linkText "Назад к чатам"}}
        </a>
      </section>
    </main>
  `;

  constructor(props = {} as ErrorPageProps) {
    super({
      code: 404,
      message: 'Не туда попали',
      linkText: 'Назад к чатам',
      ...props,
    });
  }

  protected events = {
    click: (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.error-page__link')) {
        e.preventDefault();
        this.props.onNavigate?.('');
      }
    },
  };
}
