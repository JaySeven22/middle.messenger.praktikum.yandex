import { beforeEach, describe, expect, it } from '@jest/globals';
import Input from '../Input/input.tmpl';

describe('Input', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('рендерит поле без ошибки и со значениями props', () => {
    const input = new Input({
      label: 'Логин',
      name: 'login',
      placeholder: 'Введите логин',
      value: 'user1',
    });
    const el = input.element() as HTMLElement;
    document.body.appendChild(el);

    expect(el.classList.contains('input-field')).toBe(true);
    expect(el.classList.contains('input-field--error')).toBe(false);

    const labelEl = el.querySelector('.input-field__label');
    const inputEl = el.querySelector<HTMLInputElement>('.input-field__input');

    expect(labelEl?.textContent).toBe('Логин');
    expect(inputEl?.name).toBe('login');
    expect(inputEl?.type).toBe('text');
    expect(inputEl?.getAttribute('placeholder')).toBe('Введите логин');
    expect(inputEl?.getAttribute('value')).toBe('user1');
    expect(el.querySelector('.input-field__error')).toBeNull();
  });

  it('по умолчанию выставляет type="text" если он не передан', () => {
    const input = new Input({ label: 'Имя', name: 'name' });
    const el = input.element() as HTMLElement;

    const inputEl = el.querySelector<HTMLInputElement>('.input-field__input');
    expect(inputEl?.type).toBe('text');
  });

  it('пробрасывает type=password в атрибут input', () => {
    const input = new Input({ label: 'Пароль', name: 'password', type: 'password' });
    const el = input.element() as HTMLElement;

    const inputEl = el.querySelector<HTMLInputElement>('.input-field__input');
    expect(inputEl?.type).toBe('password');
  });

  it('при наличии error добавляет модификатор и сообщение', () => {
    const input = new Input({
      label: 'Email',
      name: 'email',
      error: 'Некорректный email',
    });
    const el = input.element() as HTMLElement;

    expect(el.classList.contains('input-field--error')).toBe(true);
    const err = el.querySelector('.input-field__error');
    expect(err).not.toBeNull();
    expect(err!.textContent).toBe('Некорректный email');
  });

  it('setProps убирает ошибку при пустом error', () => {
    const input = new Input({ label: 'Email', name: 'email', error: 'oops' });
    const el = input.element() as HTMLElement;
    document.body.appendChild(el);

    input.setProps({ error: '' });

    const root = document.body.querySelector('.input-field')!;
    expect(root.classList.contains('input-field--error')).toBe(false);
    expect(root.querySelector('.input-field__error')).toBeNull();
  });
});
