import { beforeEach, describe, expect, it } from '@jest/globals';
import '../../framework/helpers';
import SearchInput from '../SearchInput/searchInput.tmpl';

describe('SearchInput', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('по умолчанию подставляет placeholder «Поиск» и пустое value', () => {
    const search = new SearchInput();
    const el = search.element() as HTMLElement;

    const input = el.querySelector<HTMLInputElement>('.search-input__input');
    const label = el.querySelector('.search-input__label');

    expect(input?.getAttribute('value')).toBe('');
    expect(input?.getAttribute('type')).toBe('text');
    expect(label?.textContent).toBe('Поиск');
  });

  it('пробрасывает value, name, id и placeholder', () => {
    const search = new SearchInput({
      value: 'привет',
      name: 'q',
      id: 'main-search',
      placeholder: 'Найти чат',
    });
    const el = search.element() as HTMLElement;

    const input = el.querySelector<HTMLInputElement>('.search-input__input');
    expect(input?.getAttribute('value')).toBe('привет');
    expect(input?.getAttribute('name')).toBe('q');
    expect(input?.getAttribute('id')).toBe('main-search');

    const label = el.querySelector('.search-input__label');
    expect(label?.textContent).toBe('Найти чат');
  });

  it('иконка поиска присутствует и помечена как aria-hidden', () => {
    const search = new SearchInput();
    const el = search.element() as HTMLElement;

    const icon = el.querySelector<HTMLImageElement>('.search-input__icon');
    expect(icon).not.toBeNull();
    expect(icon!.getAttribute('aria-hidden')).toBe('true');
  });

  it('атрибуты name/id отсутствуют в DOM, если не переданы', () => {
    const search = new SearchInput();
    const el = search.element() as HTMLElement;

    const input = el.querySelector<HTMLInputElement>('.search-input__input');
    expect(input?.hasAttribute('name')).toBe(false);
    expect(input?.hasAttribute('id')).toBe(false);
  });
});
