import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import Block from '../block';
import Route from '../route';

class StubBlock extends Block {
  protected template = '<div data-route-stub="1"></div>';
}

describe('Route', () => {
  const rootQuery = '#app';

  beforeEach(() => {
    document.body.innerHTML = `<div id="app"></div>`;
  });

  it('match возвращает true только при полном совпадении pathname', () => {
    const route = new Route('/chat', StubBlock, { rootQuery });

    expect(route.match('/chat')).toBe(true);
    expect(route.match('/chat/')).toBe(false);
    expect(route.match('/')).toBe(false);
  });

  it('navigate вызывает render только если pathname совпадает с маршрутом', () => {
    const route = new Route('/profile', StubBlock, { rootQuery });
    const renderSpy = jest.spyOn(route, 'render');

    route.navigate('/other');
    expect(renderSpy).not.toHaveBeenCalled();

    route.navigate('/profile');
    expect(renderSpy).toHaveBeenCalledTimes(1);

    renderSpy.mockRestore();
  });

  it('render монтирует блок в root и при повторном вызове переподключает DOM', () => {
    const route = new Route('/home', StubBlock, { rootQuery });

    route.render();
    const root = document.querySelector(rootQuery)!;
    expect(root.querySelector('[data-route-stub="1"]')).not.toBeNull();

    route.render();
    expect(root.querySelectorAll('[data-route-stub="1"]')).toHaveLength(1);
  });

  it('leave скрывает блок и удаляет элемент из DOM после render', () => {
    const route = new Route('/settings', StubBlock, { rootQuery });
    route.render();

    const el = document.querySelector('[data-route-stub="1"]')!;
    expect(document.body.contains(el)).toBe(true);

    route.leave();

    expect(el.parentElement).toBeNull();
  });
});
