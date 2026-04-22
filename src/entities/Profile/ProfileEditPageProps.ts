import type { BlockOwnProps } from '../../framework/block';

export type ProfileEditPageProps = BlockOwnProps & {
  email?: string;
  login?: string;
  firstName?: string;
  secondName?: string;
  displayName?: string;
  phone?: string;
  avatar?: string;
  onNavigate?: (page: string) => void;
  onAvatarSubmit?: (file: File) => Promise<unknown> | unknown | void;
};
