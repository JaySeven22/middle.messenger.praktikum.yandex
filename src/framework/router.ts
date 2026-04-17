import Route, { type RouteBlockConstructor } from './route';

export default class Router {
  private static __instance: Router;

  routes: Route[] = [];

  history = window.history;

  private _currentRoute: Route | null = null;

  private _fallbackRoute: Route | null = null;

  private _rootQuery: string;

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

  private _onRoute(pathname: string) {
    const path = pathname || '/';
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
