import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import Button from '../Button/button.tmpl';

describe('Button', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('по умолчанию рендерит filled-кнопку с типом button и подписью «Принять»', () => {
    const btn = new Button();
    const el = btn.element() as HTMLButtonElement;

    expect(el.tagName).toBe('BUTTON');
    expect(el.getAttribute('type')).toBe('button');
    expect(el.classList.contains('button')).toBe(true);
    expect(el.classList.contains('button--filled')).toBe(true);
    expect(el.textContent?.trim()).toBe('Принять');
  });

  it('применяет переданные label, variant и type', () => {
    const btn = new Button({
      label: 'Войти',
      variant: 'outlined',
      type: 'submit',
    });
    const el = btn.element() as HTMLButtonElement;

    expect(el.classList.contains('button--outlined')).toBe(true);
    expect(el.getAttribute('type')).toBe('submit');
    expect(el.textContent?.trim()).toBe('Войти');
  });

  it('setProps обновляет подпись и вариант без пересоздания узла', () => {
    const btn = new Button({ label: 'A', variant: 'filled' });
    const first = btn.element()!;
    document.body.appendChild(first);

    btn.setProps({ label: 'B', variant: 'ghost' });

    const rendered = document.body.querySelector('button')!;
    expect(rendered.textContent?.trim()).toBe('B');
    expect(rendered.classList.contains('button--ghost')).toBe(true);
  });

  it('реагирует на клик, если в setProps добавить обработчик через подкласс', () => {
    const onClick = jest.fn();

    class ClickButton extends Button {
      protected events = {
        click: () => onClick(),
      };
    }

    const btn = new ClickButton({ label: 'Click', type: 'button' });
    const el = btn.element() as HTMLElement;
    el.dispatchEvent(new Event('click', { bubbles: true }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
