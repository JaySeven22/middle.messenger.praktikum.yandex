export const API_HOST: string =
  import.meta.env.VITE_API_HOST ?? 'https://ya-praktikum.tech';

export const RESOURCES_BASE: string =
  import.meta.env.VITE_RESOURCES_BASE ?? `${API_HOST}/api/v2/resources`;

/** Origin для WebSocket чата: `wss://…` + путь `/ws/chats/...` задаётся в buildChatSocketUrl. */
export const WS_ORIGIN: string =
  import.meta.env.VITE_WS_ORIGIN ?? defaultWsOriginFromApiHost(API_HOST);

function defaultWsOriginFromApiHost(apiHost: string): string {
  if (apiHost.startsWith('https://')) {
    return `wss://${apiHost.slice('https://'.length)}`;
  }
  if (apiHost.startsWith('http://')) {
    return `ws://${apiHost.slice('http://'.length)}`;
  }
  return `wss://${apiHost}`;
}
