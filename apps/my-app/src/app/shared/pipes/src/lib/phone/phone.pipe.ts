// phone.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
  standalone: true,
})
export class PhonePipe implements PipeTransform {
  transform(value: string | number, format: 'vn' | 'us' = 'vn'): string {
    if (!value) return '';

    // xóa tất cả ký tự không phải số
    const cleaned = String(value).replace(/\D/g, '');

    if (format === 'vn') {
      return this.formatVN(cleaned);
    }

    return this.formatUS(cleaned);
  }

  private formatVN(phone: string): string {
    // 0987 654 321
    if (phone.length === 10) {
      return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    }

    // +84 987 654 321
    if (phone.length === 11 && phone.startsWith('84')) {
      return phone.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
    }

    return phone;   // không khớp → trả nguyên
  }

  private formatUS(phone: string): string {
    // (098) 765-4321
    if (phone.length === 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }

    return phone;
  }
}