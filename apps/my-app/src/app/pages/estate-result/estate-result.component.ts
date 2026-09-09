import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { type IconName } from '@icons';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

interface AmenityTag {
  icon: IconName;
  label: string;
}

interface ReferenceUnit {
  stt: number;
  floor: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  priceFrom: number;
  priceTo: number;
}

@Component({
  selector: 'vcb-estate-result',
  templateUrl: './estate-result.component.html',
  styleUrls: ['./estate-result.component.scss'],
  imports: [RouterLink, IconComponent, ButtonComponent],
})
export class EstateResultComponent  {
  remainingLookups = 4;

  addressParts: string[] = [
    'Hà Nội',
    'Phường Trâu Quỳ',
    'Vinhomes Ocean Park',
    'The Pavilion',
    '2004S1',
  ];

  amenityTags: AmenityTag[] = [
    { icon: 'iconUpDown', label: '100m²' },
    { icon: 'iconDoor', label: '3 Phòng ngủ' },
    { icon: 'iconWC', label: '2 Phòng vệ sinh' },
    { icon: 'iconCorner', label: 'Căn góc' },
    { icon: 'iconBuilding', label: 'The Pavilion' },
  ];

  totalValueFrom = 12560000000;
  totalValueTo = 15560000000;

  unitPriceFrom = 125000000;
  unitPriceTo = 150000000;

  referenceUnits: ReferenceUnit[] = [
    {
      stt: 1,
      floor: '08',
      area: 88.5,
      bedrooms: 2,
      bathrooms: 1,
      type: 'Căn thường',
      priceFrom: 95.2,
      priceTo: 102.4,
    },
    {
      stt: 2,
      floor: '10',
      area: 75,
      bedrooms: 2,
      bathrooms: 1,
      type: 'Căn góc',
      priceFrom: 105,
      priceTo: 110,
    },
    {
      stt: 3,
      floor: '12',
      area: 92,
      bedrooms: 3,
      bathrooms: 2,
      type: 'Xéo khe',
      priceFrom: 115,
      priceTo: 120,
    },
    {
      stt: 4,
      floor: '15',
      area: 88.5,
      bedrooms: 2,
      bathrooms: 1,
      type: 'Căn thường',
      priceFrom: 125,
      priceTo: 130,
    },
    {
      stt: 5,
      floor: '20',
      area: 100,
      bedrooms: 3,
      bathrooms: 2,
      type: 'Căn góc',
      priceFrom: 135,
      priceTo: 150,
    },
  ];


  formatVnd(value: number): string {
    return value.toLocaleString('en-US').replace(/,/g, '.');
  }

  formatRoundedAmount(value: number): string {
    if (value >= 1000000000) {
      const billions = value / 1000000000;
      return `${this.formatVnd(Number(billions.toFixed(3)))} tỷ đồng`;
    }

    const millions = value / 1000000;
    return `${this.formatVnd(Number(millions.toFixed(0)))} triệu đồng`;
  }
}
