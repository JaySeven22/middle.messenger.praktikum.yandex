import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import Block from '../block.js';

class PageLogin extends Block {
  protected template = '<div id="page-login"></div>';
}

class PageApp extends Block {
  protected template = '<div id="page-app"></div>';
}

class PageChat extends Block {
  protected template = '<div id="page-chat"></div>';
}

class PageFallback extends Block {
  protected template = '<div id="page-fallback"></div>';
}

describe('Router', () => {
  const rootQuery = '#app';

  beforeEach(() => {
    document.body.innerHTML = `<div id="app"></div>`;
    window.history.pushState({}, '', '/');
    jest.resetModules();
  });

  async function loadRouter() {
    const mod = await import('../router.js');
    return mod.default;
  }

  it('go вызывает history.pushState и переключает активный маршрут', async () => {
    const Router = await loadRouter();
    const pushSpy = jest.spyOn(window.history, 'pushState');

    const router = new Router(rootQuery);
    router.use('/login', PageLogin).use('/app', PageApp).start();

    router.go('/login');
    expect(pushSpy).toHaveBeenCalledWith({}, '', '/login');
    expect(document.querySelector('#page-login')).not.toBeNull();

    router.go('/app');
    expect(pushSpy).toHaveBeenLastCalledWith({}, '', '/app');
    expect(document.querySelector('#page-app')).not.toBeNull();
    expect(document.querySelector('#page-login')).toBeNull();

    pushSpy.mockRestore();
  });

  it('getRoute возвращает маршрут по pathname', async () => {
    const Router = await loadRouter();
    const router = new Router(rootQuery);
    router.use('/chat', PageChat);

    expect(router.getRoute('/chat')?.match('/chat')).toBe(true);
    expect(router.getRoute('/missing')).toBeUndefined();
  });

  it('middleware может перенаправить через history.replaceState до отрисовки', async () => {
    const Router = await loadRouter();
    const replaceSpy = jest.spyOn(window.history, 'replaceState');

    window.history.pushState({}, '', '/login');

    const router = new Router(rootQuery);
    router
      .use('/login', PageLogin)
      .use('/app', PageApp)
      .useMiddleware((pathname) => (pathname === '/login' ? '/app' : null))
      .start();

    expect(replaceSpy).toHaveBeenCalledWith({}, '', '/app');
    expect(document.querySelector('#page-app')).not.toBeNull();
    expect(document.querySelector('#page-login')).toBeNull();

    replaceSpy.mockRestore();
  });

  it('useFallback отрисовывается, если совпадений нет', async () => {
    const Router = await loadRouter();
    window.history.pushState({}, '', '/unknown');

    const router = new Router(rootQuery);
    router.use('/only', PageChat).useFallback(PageFallback).start();

    expect(document.querySelector('#page-fallback')).not.toBeNull();
    expect(document.querySelector('#page-chat')).toBeNull();
  });

  it('при смене маршрута у предыдущего вызывается leave', async () => {
    const Router = await loadRouter();
    const RouteMod = await import('../route.js');
    const leaveSpy = jest.spyOn(RouteMod.default.prototype, 'leave');

    const router = new Router(rootQuery);
    router.use('/a', PageLogin).use('/b', PageApp).start();

    router.go('/a');
    router.go('/b');

    expect(leaveSpy).toHaveBeenCalled();
    leaveSpy.mockRestore();
  });

  it('start подписывает onpopstate и обрабатывает возврат по истории', async () => {
    const Router = await loadRouter();
    const router = new Router(rootQuery);
    router.use('/one', PageLogin).use('/two', PageApp).start();

    router.go('/one');
    router.go('/two');
    expect(document.querySelector('#page-app')).not.toBeNull();

    await new Promise<void>((resolve) => {
      window.addEventListener('popstate', () => resolve(), { once: true });
      window.history.back();
    });

    expect(window.location.pathname).toBe('/one');
    expect(document.querySelector('#page-login')).not.toBeNull();
  });

  it('ограничивает глубину цепочки редиректов middleware', async () => {
    const Router = await loadRouter();
    const replaceSpy = jest.spyOn(window.history, 'replaceState');

    window.history.pushState({}, '', '/a');

    const pingPong: (pathname: string) => string | null = (pathname) =>
      pathname === '/a' ? '/b' : pathname === '/b' ? '/a' : null;

    const router = new Router(rootQuery);
    router.use('/a', PageLogin).use('/b', PageApp).useMiddleware(pingPong).start();

    expect(replaceSpy.mock.calls.length).toBeLessThanOrEqual(9);

    replaceSpy.mockRestore();
  });
});
