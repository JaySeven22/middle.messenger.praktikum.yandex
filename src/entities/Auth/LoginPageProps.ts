import type { BlockOwnProps } from '../../framework/block';

export type LoginPageProps = BlockOwnProps & {
  onNavigate?: (page: string) => void;
};
