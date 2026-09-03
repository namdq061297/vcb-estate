// format-number.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '';

    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) return '';

    return num.toLocaleString('en-US', { maximumFractionDigits: 20 }); // dấu ',' phân cách hàng nghìn, giữ đầy đủ phần thập phân
  }
}
