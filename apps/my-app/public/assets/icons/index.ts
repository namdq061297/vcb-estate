export const ICONS = {
  ic_back: '/assets/icons/ic_back.svg',
  ic_logo_full: '/assets/icons/logo_full.svg',
  ic_warning: '/assets/icons/ic_warning.svg',
} as const;

export type IconName = keyof typeof ICONS;
