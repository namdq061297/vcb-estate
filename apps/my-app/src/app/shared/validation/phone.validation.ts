export const PHONE_PATTERN_SOURCE = '^0[0-9]{9}$';
export const PHONE_PATTERN = new RegExp(PHONE_PATTERN_SOURCE);

export function isValidPhoneNumber(value: string): boolean {
  return PHONE_PATTERN.test(value.trim());
}