export const API_HOST: string =
  import.meta.env.VITE_API_HOST ?? 'https://ya-praktikum.tech';

export const RESOURCES_BASE: string =
  import.meta.env.VITE_RESOURCES_BASE ?? `${API_HOST}/api/v2/resources`;
