interface ImportMetaEnv {
  readonly VITE_API_HOST?: string;
  readonly VITE_RESOURCES_BASE?: string;
  readonly VITE_WS_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface WindowEventMap {
  'api:server-error': CustomEvent<{ status: number }>;
}
