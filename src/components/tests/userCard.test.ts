import { beforeEach, describe, expect, it } from '@jest/globals';
import '../../framework/helpers';
import UserCard from '../UserCard/userCard.tmpl';

describe('UserCard', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('без avatar показывает первую заглавную букву имени', () => {
    const card = new UserCard({ name: 'иван', lastMessage: 'Привет', time: '12:00' });
    const el = card.element() as HTMLElement;

    expect(el.querySelector('.user-card__avatar-img')).toBeNull();
    const letter = el.querySelector('.user-card__avatar-letter');
    expect(letter).not.toBeNull();
    expect(letter!.textContent).toBe('И');
  });

  it('с avatar рендерит изображение с alt=name', () => {
    const card = new UserCard({ name: 'Иван', avatar: '/i.png' });
    const el = card.element() as HTMLElement;

    const img = el.querySelector<HTMLImageElement>('.user-card__avatar-img');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe('/i.png');
    expect(img!.getAttribute('alt')).toBe('Иван');
    expect(el.querySelector('.user-card__avatar-letter')).toBeNull();
  });

  it('active добавляет модификатор user-card--active', () => {
    const card = new UserCard({ name: 'Анна', active: true });
    const el = card.element() as HTMLElement;

    expect(el.classList.contains('user-card--active')).toBe(true);
  });

  it('isOwn добавляет префикс «Вы:» к сообщению', () => {
    const card = new UserCard({ name: 'A', lastMessage: 'hi', isOwn: true });
    const el = card.element() as HTMLElement;

    const message = el.querySelector('.user-card__message')!;
    expect(message.textContent).toContain('Вы:');
    expect(message.textContent).toContain('hi');
  });

  it('unreadCount > 0 показывает бейдж с количеством', () => {
    const card = new UserCard({ name: 'A', unreadCount: 7 });
    const el = card.element() as HTMLElement;

    const badge = el.querySelector('.user-card__badge');
    expect(badge).not.toBeNull();
    expect(badge!.textContent).toBe('7');
    expect(badge!.getAttribute('aria-label')).toBe('7 непрочитанных');
  });

  it('unreadCount = 0 не рендерит бейдж', () => {
    const card = new UserCard({ name: 'A', unreadCount: 0 });
    const el = card.element() as HTMLElement;

    expect(el.querySelector('.user-card__badge')).toBeNull();
  });

  it('id отображается в подписи к сообщению', () => {
    const card = new UserCard({ name: 'A', lastMessage: 'hello', id: 42 });
    const el = card.element() as HTMLElement;

    const idEl = el.querySelector('.user-card__message-id');
    expect(idEl).not.toBeNull();
    expect(idEl!.textContent).toContain('42');
  });

  it('time отображается в строке заголовка', () => {
    const card = new UserCard({ name: 'A', time: '15:42' });
    const el = card.element() as HTMLElement;

    expect(el.querySelector('.user-card__time')!.textContent).toBe('15:42');
  });
});
