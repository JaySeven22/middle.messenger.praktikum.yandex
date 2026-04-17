import Block, { type BlockOwnProps } from './block';
import { render } from '../utils/renderDom';

export interface RouteProps {
  rootQuery: string;
}

// Конструктор страницы без аргументов 
export type RouteBlockConstructor = new () => Block<BlockOwnProps>;

export default class Route {
  private _pathname: string;

  private _blockClass: RouteBlockConstructor;

  private _block: Block<BlockOwnProps> | null;

  private _props: RouteProps;

  constructor(pathname: string, view: RouteBlockConstructor, props: RouteProps) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this._block) {
      this._block.hide();
      const el = this._block.element();
      el?.remove();
    }
  }

  match(pathname: string): boolean {
    return pathname === this._pathname;
  }

  render(): void {
    if (!this._block) {
      this._block = new this._blockClass();
      render(this._props.rootQuery, this._block);
      return;
    }

    const root = document.querySelector(this._props.rootQuery);
    const el = this._block.element();
    if (root && el) {
      root.innerHTML = '';
      root.appendChild(el);
    }
    this._block.show();
  }
}
