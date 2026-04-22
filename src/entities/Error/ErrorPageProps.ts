import type { BlockOwnProps } from '../../framework/block';

export type ErrorPageProps = BlockOwnProps & {
  code?: number;
  message?: string;
  linkText?: string;
  linkHref?: string;
  onNavigate?: (page: string) => void;
};
