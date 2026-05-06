export type ChatMessageRaw = {
  id: number;
  type?: string;
  user_id: number;
  chat_id?: number;
  content: string;
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  } | null;
  time: string;
  is_read?: boolean;
};

export type ChatMessageView = {
  dateSeparator?: string;
  text?: string;
  time?: string;
  isOwn?: boolean;
  image?: string;
};
