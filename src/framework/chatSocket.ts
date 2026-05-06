import { WS_ORIGIN } from './env';

/**
 * Тип сообщения, которое прилетает из WebSocket-сервера чата
 * после `JSON.parse`. Сервер шлёт либо служебные сообщения
 * (`pong`, `user connected`), либо одно сообщение чата (объект),
 * либо массив сообщений (история — ответ на `get old`).
 */
export type ChatSocketMessage =
  | {
      type: 'pong';
    }
  | {
      type: 'user connected';
      content: string;
    }
  | {
      type: 'message' | 'file' | 'sticker';
      id?: number;
      time?: string;
      user_id?: number;
      chat_id?: number;
      content: string;
      file?: unknown;
    }
  | Array<Record<string, unknown>>
  | Record<string, unknown>;

export type ChatSocketListeners = {
  onOpen?: () => void;
  onMessage?: (message: ChatSocketMessage, raw: MessageEvent) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
};

const PING_INTERVAL_MS = 25_000;

export function buildChatSocketUrl(userId: number, chatId: number, token: string): string {
  const origin = WS_ORIGIN.replace(/\/$/, '');
  return `${origin}/ws/chats/${userId}/${chatId}/${token}`;
}

/**
 * Обёртка над браузерным WebSocket для чата.
 *
 * - Cookie с авторизацией браузер прицепляет к WS-handshake сам,
 *   потому что хост тот же, что и у HTTP API.
 * - Каждые `PING_INTERVAL_MS` миллисекунд шлём `{type: "ping"}`,
 *   чтобы сервер не закрыл соединение по таймауту.
 * - В `onMessage` отдаём уже распарсенный JSON, а служебные `pong`
 *   проглатываем сами.
 */
export default class ChatWebSocket {
  private socket: WebSocket | null = null;

  private pingTimer: number | null = null;

  private listeners: ChatSocketListeners | undefined;

  open(userId: number, chatId: number, token: string, listeners?: ChatSocketListeners): void {
    this.close();
    this.listeners = listeners;

    const ws = new WebSocket(buildChatSocketUrl(userId, chatId, token));
    this.socket = ws;

    ws.addEventListener('open', this.handleOpen);
    ws.addEventListener('message', this.handleMessage);
    ws.addEventListener('error', this.handleError);
    ws.addEventListener('close', this.handleClose);
  }

  close(code?: number, reason?: string): void {
    this.stopPing();
    if (!this.socket) {
      return;
    }
    this.socket.removeEventListener('open', this.handleOpen);
    this.socket.removeEventListener('message', this.handleMessage);
    this.socket.removeEventListener('error', this.handleError);
    this.socket.removeEventListener('close', this.handleClose);
    if (code !== undefined || reason !== undefined) {
      this.socket.close(code, reason);
    } else {
      this.socket.close();
    }
    this.socket = null;
    this.listeners = undefined;
  }

  send(data: string | Blob | ArrayBufferLike | ArrayBufferView): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      return;
    }
    this.socket.send(data);
  }

  sendJson(payload: Record<string, unknown>): void {
    this.send(JSON.stringify(payload));
  }

  getReadyState(): number {
    return this.socket?.readyState ?? WebSocket.CLOSED;
  }

  private handleOpen = (): void => {
    this.startPing();
    this.listeners?.onOpen?.();
  };

  private handleMessage = (event: MessageEvent): void => {
    let parsed: ChatSocketMessage | string = event.data;
    if (typeof event.data === 'string') {
      try {
        parsed = JSON.parse(event.data) as ChatSocketMessage;
      } catch {
        parsed = event.data;
      }
    }

    if (
      parsed &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed) &&
      (parsed as { type?: unknown }).type === 'pong'
    ) {
      return;
    }

    this.listeners?.onMessage?.(parsed as ChatSocketMessage, event);
  };

  private handleError = (event: Event): void => {
    this.listeners?.onError?.(event);
  };

  private handleClose = (event: CloseEvent): void => {
    this.stopPing();
    this.listeners?.onClose?.(event);
  };

  private startPing(): void {
    this.stopPing();
    this.pingTimer = window.setInterval(() => {
      if (this.socket?.readyState !== WebSocket.OPEN) {
        return;
      }
      this.sendJson({ type: 'ping' });
    }, PING_INTERVAL_MS);
  }

  private stopPing(): void {
    if (this.pingTimer !== null) {
      window.clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }
}
