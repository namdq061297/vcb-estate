export const IMAGES = {
  login_bg: '/assets/images/login_bg.png',
} as const;

export type ImageName = keyof typeof IMAGES;
