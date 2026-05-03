import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';
import type { ModalField } from '../../entities/Modal';

type ModalProps = BlockOwnProps & {
  title: string;
  fields?: ModalField[];
  submitLabel?: string;
  isFileUpload?: boolean;
  fileFieldName?: string;
  fileAccept?: string;
  filePickLabel?: string;
  titleOnSelect?: string;
  titleOnFailure?: string;
  fileMissingError?: string;
  onSubmit?: (values: Record<string, string>) => Promise<unknown> | unknown | void;
  onFileSubmit?: (file: File) => Promise<unknown> | unknown | void;
  onClose?: () => void;
};

type UploadState = 'idle' | 'selected' | 'missing' | 'failed';

export default class Modal extends Block<ModalProps> {
  static componentName = 'Modal';

  protected template = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="{{title}}">
      <div class="modal__backdrop" data-modal-close="true"></div>
      <div class="modal__panel" role="document">
        <button class="modal__close" type="button" aria-label="Закрыть" data-modal-close="true">
          <span class="modal__close-icon" aria-hidden="true"></span>
        </button>
        <h2 class="modal__title">{{title}}</h2>
        <form class="modal__form">
          {{#if isFileUpload}}
            <div class="modal__file-upload">
              <button type="button" class="modal__file-pick">{{filePickLabel}}</button>
              <span class="modal__file-name" hidden></span>
              <input
                type="file"
                class="modal__file-input"
                name="{{fileFieldName}}"
                accept="{{fileAccept}}"
                hidden
              />
            </div>
          {{else}}
            {{#each fields}}
              {{Input label=label name=name type=type value=value placeholder=placeholder}}
            {{/each}}
          {{/if}}
          {{Button type="submit" variant="filled" label=submitLabel}}
          {{#if isFileUpload}}
            <p class="modal__file-error" hidden></p>
          {{/if}}
        </form>
      </div>
    </div>
  `;

  constructor(props = {} as ModalProps) {
    super({
      fields: [],
      submitLabel: 'Подтвердить',
      isFileUpload: false,
      fileFieldName: 'file',
      fileAccept: '',
      filePickLabel: 'Выбрать файл на компьютере',
      titleOnSelect: 'Файл загружен',
      titleOnFailure: 'Ошибка, попробуйте ещё раз',
      fileMissingError: 'Нужно выбрать файл',
      ...props,
    });
  }

  public open(): void {
    const root = this.element();
    if (root instanceof HTMLElement) {
      root.classList.add('modal--open');
      const firstInput = root.querySelector<HTMLInputElement>('.modal__form input');
      firstInput?.focus();
    }
  }

  public close(): void {
    const root = this.element();
    if (!(root instanceof HTMLElement)) return;
    if (!root.classList.contains('modal--open')) return;
    root.classList.remove('modal--open');
    this.resetForm();
    this.setUploadState('idle');
    this.props.onClose?.();
  }

  private resetForm(): void {
    const root = this.element();
    if (!(root instanceof HTMLElement)) return;
    const form = root.querySelector<HTMLFormElement>('.modal__form');
    form?.reset();
    const nameEl = root.querySelector<HTMLElement>('.modal__file-name');
    if (nameEl) {
      nameEl.textContent = '';
      nameEl.hidden = true;
    }
  }

  private setUploadState(state: UploadState, fileName?: string): void {
    if (!this.props.isFileUpload) return;
    const root = this.element();
    if (!(root instanceof HTMLElement)) return;

    const titleEl = root.querySelector<HTMLElement>('.modal__title');
    const pickBtn = root.querySelector<HTMLElement>('.modal__file-pick');
    const nameEl = root.querySelector<HTMLElement>('.modal__file-name');
    const errorEl = root.querySelector<HTMLElement>('.modal__file-error');

    if (!titleEl || !pickBtn || !nameEl || !errorEl) return;

    titleEl.classList.remove('modal__title--error');
    errorEl.hidden = true;
    errorEl.textContent = '';

    switch (state) {
      case 'selected': {
        titleEl.textContent = this.props.titleOnSelect ?? '';
        pickBtn.hidden = true;
        nameEl.hidden = false;
        if (fileName) nameEl.textContent = fileName;
        break;
      }
      case 'missing': {
        titleEl.textContent = this.props.title;
        pickBtn.hidden = false;
        nameEl.hidden = true;
        nameEl.textContent = '';
        errorEl.hidden = false;
        errorEl.textContent = this.props.fileMissingError ?? '';
        break;
      }
      case 'failed': {
        titleEl.textContent = this.props.titleOnFailure ?? '';
        titleEl.classList.add('modal__title--error');
        pickBtn.hidden = false;
        nameEl.hidden = true;
        nameEl.textContent = '';
        this.resetForm();
        break;
      }
      case 'idle':
      default: {
        titleEl.textContent = this.props.title;
        pickBtn.hidden = false;
        nameEl.hidden = true;
        nameEl.textContent = '';
        break;
      }
    }
  }

  private isOpen(): boolean {
    const root = this.element();
    return root instanceof HTMLElement && root.classList.contains('modal--open');
  }

  private handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.isOpen()) this.close();
  };

  protected componentDidMount(): void {
    document.addEventListener('keydown', this.handleEscape);
  }

  protected componentWillUnmount(): void {
    document.removeEventListener('keydown', this.handleEscape);
  }

  protected events = {
    click: (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.closest('[data-modal-close="true"]')) {
        e.preventDefault();
        this.close();
        return;
      }

      if (target.closest('.modal__file-pick')) {
        e.preventDefault();
        const root = this.element();
        if (!(root instanceof HTMLElement)) return;
        const fileInput = root.querySelector<HTMLInputElement>('.modal__file-input');
        fileInput?.click();
      }
    },
    change: (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (!input.classList.contains('modal__file-input')) return;
      const file = input.files?.[0];
      if (file) {
        this.setUploadState('selected', file.name);
      } else {
        this.setUploadState('idle');
      }
    },
    submit: (e: Event) => {
      const form = e.target as HTMLFormElement;
      if (!form.classList.contains('modal__form')) return;
      e.preventDefault();

      if (this.props.isFileUpload) {
        const fileInput = form.querySelector<HTMLInputElement>('.modal__file-input');
        const file = fileInput?.files?.[0];
        if (!file) {
          this.setUploadState('missing');
          return;
        }

        const result = this.props.onFileSubmit?.(file);
        if (result && typeof (result as Promise<unknown>).then === 'function') {
          (result as Promise<unknown>)
            .then(() => this.close())
            .catch(() => this.setUploadState('failed'));
        } else {
          this.close();
        }
        return;
      }

      const formData = new FormData(form);
      const values: Record<string, string> = {};
      formData.forEach((v, k) => {
        values[k] = typeof v === 'string' ? v : '';
      });
      const result = this.props.onSubmit?.(values);
      if (result && typeof (result as Promise<unknown>).then === 'function') {
        (result as Promise<unknown>)
          .then(() => this.close())
          .catch(() => { /* остаёмся открытыми — ошибка показана снаружи */ });
      } else {
        this.close();
      }
    },
  };
}
