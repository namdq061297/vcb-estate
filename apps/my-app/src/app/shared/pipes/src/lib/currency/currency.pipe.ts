// currency.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vndCurrency',
})
export class VndCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '';

    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) return '';

    // format số với dấu ',' phân cách hàng nghìn, giữ đầy đủ phần thập phân
    const formatted = num.toLocaleString('en-US', { maximumFractionDigits: 20 });

    return `${formatted} VND`;
  }
}