import type { BlockOwnProps } from '../../framework/block';

export type PasswordEditPageProps = BlockOwnProps & {
  passwordOld?: string;
  passwordNew?: string;
  passwordNewRepeat?: string;
  displayName?: string;
  avatar?: string;
  onNavigate?: (page: string) => void;
};
