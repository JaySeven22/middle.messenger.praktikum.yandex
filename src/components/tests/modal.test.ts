import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import '../../framework/helpers';
// Регистрируем компоненты Input/Button как Handlebars-хелперы — они используются в шаблоне Modal.
import '../Input';
import '../Button';
import Modal from '../Modal/modal.tmpl';

function mount(modal: Modal): HTMLElement {
  const el = modal.element() as HTMLElement;
  document.body.appendChild(el);
  return el;
}

describe('Modal', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('рендерит заголовок и поля формы по списку fields', () => {
    const modal = new Modal({
      title: 'Изменить данные',
      fields: [
        { label: 'Имя', name: 'first_name', value: 'Иван', placeholder: 'Имя' },
        { label: 'Email', name: 'email', value: 'a@b.c', placeholder: 'Email' },
      ],
      submitLabel: 'Сохранить',
    });
    const el = mount(modal);

    expect(el.querySelector('.modal__title')!.textContent).toBe('Изменить данные');
    expect(el.querySelectorAll('.input-field')).toHaveLength(2);

    const inputs = el.querySelectorAll<HTMLInputElement>('.modal__form input');
    expect(inputs[0].name).toBe('first_name');
    expect(inputs[1].name).toBe('email');

    const submit = el.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(submit.textContent?.trim()).toBe('Сохранить');
  });

  it('open добавляет класс modal--open и фокусирует первый input', () => {
    const modal = new Modal({
      title: 't',
      fields: [{ label: 'L', name: 'login' }],
    });
    const el = mount(modal);

    modal.open();

    expect(el.classList.contains('modal--open')).toBe(true);
    expect(document.activeElement).toBe(el.querySelector('input[name="login"]'));
  });

  it('close закрывает модалку и вызывает onClose, форма сбрасывается', () => {
    const onClose = jest.fn();
    const modal = new Modal({
      title: 't',
      fields: [{ label: 'L', name: 'login', value: '' }],
      onClose,
    });
    const el = mount(modal);
    modal.open();

    const input = el.querySelector<HTMLInputElement>('input[name="login"]')!;
    input.value = 'typed';

    modal.close();

    expect(el.classList.contains('modal--open')).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('');
  });

  it('повторный close без open не вызывает onClose', () => {
    const onClose = jest.fn();
    const modal = new Modal({ title: 't', onClose });
    mount(modal);

    modal.close();

    expect(onClose).not.toHaveBeenCalled();
  });

  it('клик по data-modal-close="true" закрывает модалку', () => {
    const modal = new Modal({ title: 't' });
    const el = mount(modal);
    modal.open();

    const closeBtn = el.querySelector<HTMLElement>('.modal__close')!;
    closeBtn.dispatchEvent(new Event('click', { bubbles: true }));

    expect(el.classList.contains('modal--open')).toBe(false);
  });

  it('Escape закрывает открытую модалку', () => {
    const modal = new Modal({ title: 't' });
    mount(modal);
    modal.open();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(modal.element()!.classList.contains('modal--open')).toBe(false);
  });

  it('Escape ничего не делает у закрытой модалки', () => {
    const modal = new Modal({ title: 't' });
    const el = mount(modal);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(el.classList.contains('modal--open')).toBe(false);
  });

  it('отправка обычной формы вызывает onSubmit с данными и закрывает модалку (синхронный onSubmit)', () => {
    const onSubmit = jest.fn();
    const modal = new Modal({
      title: 't',
      fields: [
        { label: 'Логин', name: 'login', value: '' },
        { label: 'Имя', name: 'first_name', value: '' },
      ],
      onSubmit,
    });
    const el = mount(modal);
    modal.open();

    const form = el.querySelector<HTMLFormElement>('.modal__form')!;
    form.querySelector<HTMLInputElement>('input[name="login"]')!.value = 'user1';
    form.querySelector<HTMLInputElement>('input[name="first_name"]')!.value = 'Иван';

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ login: 'user1', first_name: 'Иван' });
    expect(el.classList.contains('modal--open')).toBe(false);
  });

  it('асинхронный onSubmit закрывает модалку только после успешного промиса', async () => {
    let resolveFn: (() => void) = () => {};
    const onSubmit = jest.fn(() => new Promise<void>((res) => { resolveFn = res; }));

    const modal = new Modal({
      title: 't',
      fields: [{ label: 'Логин', name: 'login', value: 'a' }],
      onSubmit,
    });
    const el = mount(modal);
    modal.open();

    const form = el.querySelector<HTMLFormElement>('.modal__form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(el.classList.contains('modal--open')).toBe(true);

    resolveFn();
    await Promise.resolve();
    await Promise.resolve();

    expect(el.classList.contains('modal--open')).toBe(false);
  });

  it('файловая модалка без выбранного файла показывает ошибку и не вызывает onFileSubmit', () => {
    const onFileSubmit = jest.fn();
    const modal = new Modal({
      title: 'Загрузка',
      isFileUpload: true,
      onFileSubmit,
      fileMissingError: 'Нужно выбрать файл',
    });
    const el = mount(modal);
    modal.open();

    const form = el.querySelector<HTMLFormElement>('.modal__form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(onFileSubmit).not.toHaveBeenCalled();
    const error = el.querySelector<HTMLElement>('.modal__file-error')!;
    expect(error.hidden).toBe(false);
    expect(error.textContent).toBe('Нужно выбрать файл');
  });

  it('клик по «Выбрать файл» прокидывает клик на скрытый input[type=file]', () => {
    const modal = new Modal({ title: 'Загрузка', isFileUpload: true });
    const el = mount(modal);

    const fileInput = el.querySelector<HTMLInputElement>('.modal__file-input')!;
    const clickSpy = jest.spyOn(fileInput, 'click').mockImplementation(() => undefined);

    const pick = el.querySelector<HTMLElement>('.modal__file-pick')!;
    pick.dispatchEvent(new Event('click', { bubbles: true }));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
