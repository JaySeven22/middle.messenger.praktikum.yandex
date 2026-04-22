export type DropdownMenuItem = {
  label: string;
  action: string;
  /** Иконка из CSS: плюс/крестик в синем круге-обводке (как в макете чата) */
  icon?: 'add' | 'remove';
  /** Картинка: путь из `public/`, например `/media.svg` */
  iconSrc?: string;
  danger?: boolean;
};
