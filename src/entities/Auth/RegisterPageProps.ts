import type { BlockOwnProps } from '../../framework/block';

export type RegisterPageProps = BlockOwnProps & {
  onNavigate?: (page: string) => void;
};
