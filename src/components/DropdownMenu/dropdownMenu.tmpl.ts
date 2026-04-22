import Block from '../../framework/block';
import type { BlockOwnProps } from '../../framework/block';
import type { DropdownMenuItem } from '../../entities/DropdownMenu';

type DropdownMenuProps = BlockOwnProps & {
  items: DropdownMenuItem[];
  ariaLabel?: string;
  align?: 'left' | 'right';
  /** `kebab` — три точки; `attach` — скрепка из `triggerIconSrc` */
  triggerStyle?: 'kebab' | 'attach';
  /** `below` — под триггером; `above` — над триггером (например у поля ввода) */
  placement?: 'below' | 'above';
  /** Для `triggerStyle="attach"`, по умолчанию `/attach.svg` */
  triggerIconSrc?: string;
  onSelect?: (action: string) => void;
};

export default class DropdownMenu extends Block<DropdownMenuProps> {
  static componentName = 'DropdownMenu';

  protected template = `
    <div class="dropdown-menu dropdown-menu--align-{{align}}{{#if (eq placement 'above')}} dropdown-menu--placement-above{{/if}}{{#if (eq triggerStyle 'attach')}} dropdown-menu--trigger-attach{{/if}}">
      {{#if (eq triggerStyle 'attach')}}
        <button
          class="dropdown-menu__trigger dropdown-menu__trigger--attach"
          type="button"
          aria-label="{{ariaLabel}}"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <img class="dropdown-menu__trigger-img" src="{{triggerIconSrc}}" alt="" aria-hidden="true" />
        </button>
      {{else}}
        <button
          class="dropdown-menu__trigger"
          type="button"
          aria-label="{{ariaLabel}}"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <svg class="dropdown-menu__trigger-icon" width="4" height="16" viewBox="0 0 4 16" fill="none" aria-hidden="true">
            <circle cx="2" cy="2" r="2" fill="currentColor"/>
            <circle cx="2" cy="8" r="2" fill="currentColor"/>
            <circle cx="2" cy="14" r="2" fill="currentColor"/>
          </svg>
        </button>
      {{/if}}
      <ul class="dropdown-menu__list" role="menu" hidden>
        {{#each items}}
          <li role="none">
            <button
              class="dropdown-menu__item {{#if danger}}dropdown-menu__item--danger{{/if}}"
              type="button"
              role="menuitem"
              data-action="{{action}}"
            >
              {{#if iconSrc}}
                <img class="dropdown-menu__item-icon-img" src="{{iconSrc}}" alt="" aria-hidden="true" />
              {{else}}
                {{#if icon}}
                  <span class="dropdown-menu__item-icon dropdown-menu__item-icon--{{icon}}" aria-hidden="true"></span>
                {{/if}}
              {{/if}}
              {{label}}
            </button>
          </li>
        {{/each}}
      </ul>
    </div>
  `;

  private isOpen = false;

  constructor(props = {} as DropdownMenuProps) {
    super({
      ...props,
      ariaLabel: props.ariaLabel ?? 'Меню',
      align: props.align ?? 'right',
      items: props.items ?? [],
      triggerStyle: props.triggerStyle ?? 'kebab',
      placement: props.placement ?? 'below',
      triggerIconSrc: props.triggerIconSrc ?? '/attach.svg',
    });
  }

  private handleOutsideClick = (e: Event) => {
    const root = this.element();
    const target = e.target as Node | null;
    if (!root || !target) return;
    if (!root.contains(target)) this.close();
  };

  private handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.close();
  };

  private open(): void {
    if (this.isOpen) return;
    const root = this.element();
    if (!(root instanceof HTMLElement)) return;
    const trigger = root.querySelector<HTMLButtonElement>('.dropdown-menu__trigger');
    const list = root.querySelector<HTMLElement>('.dropdown-menu__list');
    if (!trigger || !list) return;

    root.classList.add('dropdown-menu--open');
    list.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    this.isOpen = true;

    document.addEventListener('click', this.handleOutsideClick, true);
    document.addEventListener('keydown', this.handleEscape);
  }

  private close(): void {
    if (!this.isOpen) return;
    const root = this.element();
    if (!(root instanceof HTMLElement)) return;
    const trigger = root.querySelector<HTMLButtonElement>('.dropdown-menu__trigger');
    const list = root.querySelector<HTMLElement>('.dropdown-menu__list');
    if (!trigger || !list) return;

    root.classList.remove('dropdown-menu--open');
    list.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    this.isOpen = false;

    document.removeEventListener('click', this.handleOutsideClick, true);
    document.removeEventListener('keydown', this.handleEscape);
  }

  protected componentWillUnmount(): void {
    document.removeEventListener('click', this.handleOutsideClick, true);
    document.removeEventListener('keydown', this.handleEscape);
  }

  protected events = {
    click: (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.closest('.dropdown-menu__trigger')) {
        e.preventDefault();
        e.stopPropagation();
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
        return;
      }

      const item = target.closest<HTMLButtonElement>('.dropdown-menu__item');
      if (item) {
        e.preventDefault();
        e.stopPropagation();
        const action = item.dataset['action'] ?? '';
        this.props.onSelect?.(action);
        this.close();
      }
    },
  };
}
