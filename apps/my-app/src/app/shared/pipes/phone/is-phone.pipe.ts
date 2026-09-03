import { Pipe, type PipeTransform } from "@angular/core";

// is-phone.pipe.ts
@Pipe({
  name: 'isPhone',
  standalone: true,
})
export class IsPhonePipe implements PipeTransform {
  transform(value: string | number | undefined | null): boolean {
    if (value === null || value === undefined) return false;
    const cleaned = String(value).replace(/\D/g, '');
    return /^(0[3|5|7|8|9])\d{8}$/.test(cleaned);
  }
}