interface ImportMetaEnv {
  readonly VITE_API_HOST?: string;
  readonly VITE_RESOURCES_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
