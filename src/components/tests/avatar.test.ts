import { beforeEach, describe, expect, it } from '@jest/globals';
import '../../framework/helpers';
import Avatar from '../Avatar/avatar.tmpl';

describe('Avatar', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('без src показывает плейсхолдер и оверлей «Поменять аватар»', () => {
    const avatar = new Avatar();
    const el = avatar.element() as HTMLElement;
    document.body.appendChild(el);

    const wrapper = el.querySelector('.avatar')!;
    expect(wrapper.classList.contains('avatar--interactive')).toBe(true);
    expect(wrapper.querySelector('.avatar__placeholder')).not.toBeNull();
    expect(wrapper.querySelector('.avatar__image')).toBeNull();

    const overlayTexts = wrapper.querySelectorAll('.avatar__overlay-text');
    expect(overlayTexts).toHaveLength(2);
    expect(overlayTexts[0].textContent).toBe('Поменять');
    expect(overlayTexts[1].textContent).toBe('аватар');
  });

  it('с src рендерит изображение и подставляет alt из name', () => {
    const avatar = new Avatar({ src: '/me.png', name: 'Иван' });
    const el = avatar.element() as HTMLElement;

    const img = el.querySelector<HTMLImageElement>('.avatar__image');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe('/me.png');
    expect(img!.getAttribute('alt')).toBe('Иван');
    expect(el.querySelector('.avatar__placeholder')).toBeNull();
  });

  it('alt=avatar по умолчанию, если name не передано', () => {
    const avatar = new Avatar({ src: '/me.png' });
    const el = avatar.element() as HTMLElement;

    const img = el.querySelector<HTMLImageElement>('.avatar__image');
    expect(img!.getAttribute('alt')).toBe('avatar');
  });

  it('size добавляет модификатор avatar--{size}', () => {
    const avatar = new Avatar({ size: 'lg' });
    const el = avatar.element() as HTMLElement;

    const wrapper = el.querySelector('.avatar')!;
    expect(wrapper.classList.contains('avatar--lg')).toBe(true);
  });

  it('disabled убирает интерактивность и оверлей', () => {
    const avatar = new Avatar({ disabled: true });
    const el = avatar.element() as HTMLElement;

    const wrapper = el.querySelector('.avatar')!;
    expect(wrapper.classList.contains('avatar--interactive')).toBe(false);
    expect(wrapper.querySelector('.avatar__overlay')).toBeNull();
  });

  it('name выводится подписью под аватаром', () => {
    const avatar = new Avatar({ name: 'Иван' });
    const el = avatar.element() as HTMLElement;

    const nameEl = el.querySelector('.avatar__name');
    expect(nameEl).not.toBeNull();
    expect(nameEl!.textContent).toBe('Иван');
  });
});
