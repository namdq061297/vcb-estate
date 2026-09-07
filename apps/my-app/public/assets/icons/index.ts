export const ICONS = {
  ic_back: '/assets/icons/ic_back.svg',
  ic_logo_full: '/assets/icons/logo_full.svg',
  ic_warning: '/assets/icons/ic_warning.svg',
  iconBuilding: '/assets/icons/iconBuilding.svg',
  iconCorner: '/assets/icons/iconCorner.svg',
  iconDoor: '/assets/icons/iconDoor.svg',
  iconWC: '/assets/icons/iconWC.svg',
  iconUpDown: '/assets/icons/iconUpDown.svg',
} as const;

export type IconName = keyof typeof ICONS;
