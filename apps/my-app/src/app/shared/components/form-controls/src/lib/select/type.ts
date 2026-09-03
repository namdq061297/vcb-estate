export interface SelectItem<T = string> {
  value: T;
  label: string;
  extras?: { [K: string]: any };
}
