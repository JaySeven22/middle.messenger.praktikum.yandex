import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

type MockXhr = {
  open: jest.Mock;
  send: jest.Mock;
  setRequestHeader: jest.Mock;
  getResponseHeader: jest.Mock;
  status: number;
  statusText: string;
  responseText: string;
  response: unknown;
  responseType: XMLHttpRequestResponseType;
  withCredentials: boolean;
  timeout: number;
  onload: ((this: XMLHttpRequest, ev: ProgressEvent) => void) | null;
  onerror: ((this: XMLHttpRequest, ev: ProgressEvent) => void) | null;
  onabort: ((this: XMLHttpRequest, ev: ProgressEvent) => void) | null;
  ontimeout: ((this: XMLHttpRequest, ev: ProgressEvent) => void) | null;
};

function createMockXhr(overrides: Partial<Pick<MockXhr, 'status' | 'statusText' | 'responseText' | 'response' | 'responseType'>> = {}): MockXhr {
  const xhr: MockXhr = {
    open: jest.fn(),
    send: jest.fn((..._args: unknown[]) => {
      queueMicrotask(() => {
        if (xhr.onload) {
          xhr.onload.call(xhr as unknown as XMLHttpRequest, {} as ProgressEvent);
        }
      });
    }) as jest.Mock,
    setRequestHeader: jest.fn(),
    getResponseHeader: jest.fn(() => 'application/json'),
    status: 200,
    statusText: 'OK',
    responseText: '{}',
    response: null,
    responseType: '' as XMLHttpRequestResponseType,
    withCredentials: false,
    timeout: 5000,
    onload: null,
    onerror: null,
    onabort: null,
    ontimeout: null,
    ...overrides,
  };
  return xhr;
}

describe('HTTPTransport', () => {
  const OriginalXHR = global.XMLHttpRequest;
  let lastXhr: MockXhr;
  
  beforeEach(() => {
    lastXhr = createMockXhr();
    global.XMLHttpRequest = jest.fn(() => lastXhr) as unknown as typeof XMLHttpRequest;
  });

  afterEach(() => {
    global.XMLHttpRequest = OriginalXHR;
    jest.restoreAllMocks();
  });

  async function loadHTTPTransport() {
    jest.resetModules();
    await jest.unstable_mockModule('../env.js', () => ({
      API_HOST: 'https://api.test',
      RESOURCES_BASE: 'https://api.test/resources',
      WS_ORIGIN: 'wss://api.test',
    }));
    const mod = await import('../api.js');
    return mod.default;
  }

  it('get подставляет хост и путь, open с методом GET', async () => {
    const HTTPTransport = await loadHTTPTransport();
    const transport = new HTTPTransport();
    const p = transport.get('/user', {});

    expect(lastXhr.open).toHaveBeenCalledWith('GET', 'https://api.test/user');
    await expect(p).resolves.toEqual({});
  });

  it('конструктор с basePath склеивает URL и убирает завершающий слэш у base', async () => {
    const HTTPTransport = await loadHTTPTransport();
    const transport = new HTTPTransport('/api/v2');
    void transport.get('chats', {});

    expect(lastXhr.open).toHaveBeenCalledWith('GET', 'https://api.test/api/v2/chats');
  });

  it('абсолютный http(s) URL не дополняется хостом', async () => {
    const HTTPTransport = await loadHTTPTransport();
    const transport = new HTTPTransport('/api');
    void transport.get('https://other.example/data', {});

    expect(lastXhr.open).toHaveBeenCalledWith('GET', 'https://other.example/data');
  });

  it('GET с data добавляет query-string и кодирует параметры', async () => {
    const HTTPTransport = await loadHTTPTransport();
    const transport = new HTTPTransport();
    void transport.get('/search', {
      data: { q: 'a b', n: 1, skip: undefined, empty: null },
    });

    expect(lastXhr.open).toHaveBeenCalledWith(
      'GET',
      expect.stringContaining('https://api.test/search?'),
    );
    const [, url] = lastXhr.open.mock.calls[0] as [string, string];
    expect(url).toContain(encodeURIComponent('q') + '=' + encodeURIComponent('a b'));
    expect(url).toContain('n=1');
    expect(url).not.toContain('skip');
    expect(url).not.toContain('empty');
  });

  it('POST с объектом отправляет JSON и выставляет Content-Type', async () => {
    const HTTPTransport = await loadHTTPTransport();
    const transport = new HTTPTransport();
    const p = transport.post('/auth', { data: { login: 'u', pass: 'p' } });

    expect(lastXhr.open).toHaveBeenCalledWith('POST', 'https://api.test/auth');
    expect(lastXhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(lastXhr.send).toHaveBeenCalledWith(JSON.stringify({ login: 'u', pass: 'p' }));
    await expect(p).resolves.toEqual({});
  });

  it('POST с FormData не навязывает application/json', async () => {
    const HTTPTransport = await loadHTTPTransport();
    const transport = new HTTPTransport();
    const fd = new FormData();
    fd.append('file', 'x');
    void transport.post('/upload', { data: fd });

    expect(lastXhr.send).toHaveBeenCalledWith(fd);
    expect(lastXhr.setRequestHeader).not.toHaveBeenCalledWith('Content-Type', 'application/json');
  });

  it('если Content-Type задан вручную, не дублирует заголовок', async () => {
    const HTTPTransport = await loadHTTPTransport();
    const transport = new HTTPTransport();
    void transport.post('/x', {
      data: { a: 1 },
      headers: { 'Content-Type': 'text/plain' },
    });

    const contentTypeCalls = lastXhr.setRequestHeader.mock.calls.filter((c) => c[0] === 'Content-Type');
    expect(contentTypeCalls).toHaveLength(1);
    expect(contentTypeCalls[0]).toEqual(['Content-Type', 'text/plain']);
  });

  it('успешный JSON-ответ парсится в объект', async () => {
    lastXhr.getResponseHeader = jest.fn((name: unknown) =>
      String(name).toLowerCase() === 'content-type' ? 'application/json; charset=utf-8' : null,
    ) as jest.Mock;
    lastXhr.responseText = '{"id":42}';

    const HTTPTransport = await loadHTTPTransport();
    const transport = new HTTPTransport();
    const p = transport.get('/x', {});

    await expect(p).resolves.toEqual({ id: 42 });
  });

  it('успешный не-JSON отдаётся как текст', async () => {
    lastXhr.getResponseHeader = jest.fn(() => null);
    lastXhr.responseText = 'plain';

    const HTTPTransport = await loadHTTPTransport();
    const transport = new HTTPTransport();
    const p = transport.get('/x', {});

    await expect(p).resolves.toBe('plain');
  });

  it('статус вне 2xx отклоняет промис с полями ошибки', async () => {
    lastXhr.status = 401;
    lastXhr.statusText = 'Unauthorized';
    lastXhr.responseText = '{"reason":"no"}';

    const HTTPTransport = await loadHTTPTransport();
    const transport = new HTTPTransport();
    const p = transport.get('/secure', {});

    await expect(p).rejects.toMatchObject({
      status: 401,
      statusText: 'Unauthorized',
      response: '{"reason":"no"}',
    });
  });

  it('request без method отклоняет промис', async () => {
    const HTTPTransport = await loadHTTPTransport();
    const transport = new HTTPTransport();
    const p = transport.request('https://api.test/x', {});

    await expect(p).rejects.toThrow('HTTP method is required');
  });

  it('put и delete передают нужный метод в open', async () => {
    const HTTPTransport = await loadHTTPTransport();
    const transport = new HTTPTransport();

    void transport.put('/a', {});
    expect(lastXhr.open).toHaveBeenLastCalledWith('PUT', 'https://api.test/a');

    void transport.delete('/b', {});
    expect(lastXhr.open).toHaveBeenLastCalledWith('DELETE', 'https://api.test/b');
  });

  it('xhr.withCredentials === true', async () => {
    const HTTPTransport = await loadHTTPTransport();
    const transport = new HTTPTransport();
    void transport.get('/', {});

    expect(lastXhr.withCredentials).toBe(true);
  });
});
