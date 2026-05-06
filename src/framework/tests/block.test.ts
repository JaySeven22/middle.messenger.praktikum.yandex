import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import Block, { type BlockOwnProps } from '../block';

class SimpleBlock extends Block<BlockOwnProps & { label?: string }> {
  protected template = '<button class="btn">{{label}}</button>';
}

describe('Block', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('element() лениво создаёт DOM из шаблона и подставляет props', () => {
    const block = new SimpleBlock({ label: 'OK' });
    const el = block.element();

    expect(el).not.toBeNull();
    expect(el!.tagName).toBe('BUTTON');
    expect(el!.classList.contains('btn')).toBe(true);
    expect(el!.textContent?.trim()).toBe('OK');
  });

  it('element() при повторных вызовах возвращает существующий узел', () => {
    const block = new SimpleBlock({ label: 'A' });
    const first = block.element();
    const second = block.element();
    expect(first).toBe(second);
  });

  it('setProps перерисовывает разметку с новыми значениями', () => {
    const block = new SimpleBlock({ label: 'Old' });
    document.body.appendChild(block.element()!);

    block.setProps({ label: 'New' });

    expect(document.body.querySelector('.btn')!.textContent?.trim()).toBe('New');
  });

  it('hide/show управляют свойством display у HTMLElement', () => {
    const block = new SimpleBlock({ label: 'X' });
    const el = block.element() as HTMLElement;

    block.hide();
    expect(el.style.display).toBe('none');

    block.show();
    expect(el.style.display).toBe('');
  });

  it('componentDidMount вызывается ровно один раз, повторные render его не запускают', () => {
    const didMount = jest.fn();

    class WithMount extends Block<BlockOwnProps & { label?: string }> {
      protected template = '<div>{{label}}</div>';
      protected componentDidMount(): void {
        didMount();
      }
    }

    const block = new WithMount({ label: '1' });
    block.element();
    block.setProps({ label: '2' });
    block.setProps({ label: '3' });

    expect(didMount).toHaveBeenCalledTimes(1);
  });

  it('componentWillUnmount вызывается при перерисовке узла', () => {
    const willUnmount = jest.fn();

    class WithUnmount extends Block<BlockOwnProps & { label?: string }> {
      protected template = '<div>{{label}}</div>';
      protected componentWillUnmount(): void {
        willUnmount();
      }
    }

    const block = new WithUnmount({ label: 'a' });
    block.element();

    block.setProps({ label: 'b' });

    expect(willUnmount).toHaveBeenCalledTimes(1);
  });

  it('events навешиваются на корневой элемент и срабатывают на пользовательских действиях', () => {
    const onClick = jest.fn();

    class Clickable extends Block {
      protected template = '<button class="c">click</button>';
      protected events = {
        click: () => onClick(),
      };
    }

    const block = new Clickable();
    const el = block.element() as HTMLElement;
    document.body.appendChild(el);

    el.dispatchEvent(new Event('click', { bubbles: true }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('refs собираются из элементов с атрибутом ref и сам атрибут удаляется из DOM', () => {
    class WithRefs extends Block {
      protected template = `
        <div>
          <span ref="title" class="t">hi</span>
          <input ref="field" />
        </div>
      `;

      public exposeRefs() {
        return this.refs;
      }
    }

    const block = new WithRefs();
    const el = block.element()!;
    const refs = block.exposeRefs();

    expect(refs.title).toBeInstanceOf(HTMLElement);
    expect(refs.field).toBeInstanceOf(HTMLElement);
    expect(el.querySelector('[ref]')).toBeNull();
  });
});
