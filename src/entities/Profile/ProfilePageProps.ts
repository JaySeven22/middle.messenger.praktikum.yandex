import type { BlockOwnProps } from '../../framework/block';

export type ProfilePageProps = BlockOwnProps & {
  email?: string;
  login?: string;
  firstName?: string;
  secondName?: string;
  displayName?: string;
  phone?: string;
  avatar?: string;
  onNavigate?: (page: string) => void;
};
