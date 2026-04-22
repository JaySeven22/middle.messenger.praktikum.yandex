import type { BlockOwnProps } from '../../framework/block';
import type { DropdownMenuItem } from '../DropdownMenu';
import type { ModalField } from '../Modal';

export type ChatPageProps = BlockOwnProps & {
  users?: {
    id: number;
    name: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    isOwn?: boolean;
    active?: boolean;
    avatar?: string;
    isSearchResult?: boolean;
  }[];
  activeChat?: {
    id?: number;
    name: string;
    avatar?: string;
    participantsCount?: number;
    messages: {
      dateSeparator?: string;
      text?: string;
      time?: string;
      isOwn?: boolean;
      image?: string;
    }[];
  };
  menuItems?: DropdownMenuItem[];
  onMenuSelect?: (action: string) => void;
  attachMenuItems?: DropdownMenuItem[];
  onAttachMenuSelect?: (action: string) => void;
  addUserFields?: ModalField[];
  onAddUserSubmit?: (values: Record<string, string>) => void;
  removeUserFields?: ModalField[];
  onRemoveUserSubmit?: (values: Record<string, string>) => void;
  createChatFields?: ModalField[];
  onCreateChatSubmit?: (values: Record<string, string>) => void;
  onNavigate?: (page: string) => void;
  userSearchInput?: string;
};
