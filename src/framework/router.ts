import Route, { type RouteBlockConstructor } from './route';

export type RouteMiddleware = (pathname: string) => string | null;

export default class Router {
  private static __instance: Router;

  routes: Route[] = [];

  history = window.history;

  private _currentRoute: Route | null = null;

  private _fallbackRoute: Route | null = null;

  private _rootQuery: string;

  private _middlewares: RouteMiddleware[] = [];

  constructor(rootQuery: string) {
    this._rootQuery = rootQuery;

    if (Router.__instance) {
      return Router.__instance;
    }

    Router.__instance = this;
  }

  use(pathname: string, block: RouteBlockConstructor) {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  useMiddleware(middleware: RouteMiddleware) {
    this._middlewares.push(middleware);
    return this;
  }

  useFallback(block: RouteBlockConstructor) {
    this._fallbackRoute = new Route('__fallback__', block, { rootQuery: this._rootQuery });
    return this;
  }

  start() {
    window.onpopstate = () => {
      this._onRoute(window.location.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  private runMiddlewares(pathname: string): string | null {
    for (const mw of this._middlewares) {
      const to = mw(pathname);
      if (to) {
        return to;
      }
    }
    return null;
  }

  private _onRoute(pathname: string, redirectDepth = 0): void {
    if (redirectDepth > 8) {
      return;
    }

    const path = pathname || '/';
    const redirectTo = this.runMiddlewares(path);
    if (redirectTo && redirectTo !== path) {
      this.history.replaceState({}, '', redirectTo);
      this._onRoute(redirectTo, redirectDepth + 1);
      return;
    }

    const route = this.getRoute(path) ?? this._fallbackRoute;
    if (!route) {
      return;
    }

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string) {
    const path = pathname || '/';
    this.history.pushState({}, '', path);
    this._onRoute(path);
  }

  getRoute(pathname: string): Route | undefined {
    return this.routes.find((r) => r.match(pathname));
  }
}
