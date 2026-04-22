export type ChatSidebarItem = {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOwn?: boolean;
  active?: boolean;
  avatar?: string;
  /** Строка из поиска пользователей (не id чата) */
  isSearchResult?: boolean;
};
