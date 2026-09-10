import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { type IconName } from '@icons';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { EstateService } from '../../core/services/api/estate.service';
import { EstateKccValuationRequest, EstateKccValuationResult } from '../../core/models/estate.model';
import { showLoading, hideLoading } from '../../shared/components/loading/loading.state';

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
export class EstateResultComponent implements OnInit {
  private readonly estateService = inject(EstateService);

  private readonly demoRequest: EstateKccValuationRequest = {
    Tinh_Thanh_Pho: 'Hà Nội',
    Phuong_xa: 'Phường Trâu Quỳ',
    Ten_du_an: 'Vinhomes Ocean Park',
    Ten_toa_nha: 'The Pavilion',
    So_can_ho: '2004S1',
  };

  remainingLookups = 4;

  readonly addressParts = signal<string[]>([]);
  readonly amenityTags = signal<AmenityTag[]>([]);
  readonly referenceUnits = signal<ReferenceUnit[]>([]);

  readonly totalValueFrom = signal(0);
  readonly totalValueTo = signal(0);
  readonly unitPriceFrom = signal(0);
  readonly unitPriceTo = signal(0);

  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadValuation();
  }

  private loadValuation(): void {
    this.errorMessage.set(null);
    showLoading();

    this.estateService.getValuationKcc(this.demoRequest).subscribe({
      next: (response) => {
        this.applyResult(response.result);
        this.referenceUnits.set(
          response.recommendation.map((item, index) => this.toReferenceUnit(item, index)),
        );
        hideLoading();
      },
      error: () => {
        this.errorMessage.set('Không thể tải kết quả ước giá. Vui lòng thử lại.');
        hideLoading();
      },
    });
  }

  private applyResult(result: EstateKccValuationResult): void {
    this.addressParts.set(
      [
        this.demoRequest.Tinh_Thanh_Pho,
        this.demoRequest.Phuong_xa,
        result.Ten_du_an,
        result.Ten_toa_nha,
        result.So_can_ho,
      ].filter((part): part is string => Boolean(part)),
    );

    this.amenityTags.set([
      { icon: 'iconUpDown', label: `${result.Dien_tich}m²` },
      { icon: 'iconDoor', label: `${result.So_phong_ngu} Phòng ngủ` },
      { icon: 'iconWC', label: `${result.So_phong_ve_sinh} Phòng vệ sinh` },
      { icon: 'iconCorner', label: result.Vi_tri },
      { icon: 'iconBuilding', label: result.Ten_du_an },
    ]);

    this.totalValueFrom.set(result.Min_uoc_gia);
    this.totalValueTo.set(result.Max_uoc_gia);
    this.unitPriceFrom.set(result.Min_don_gia_du_doan);
    this.unitPriceTo.set(result.Max_don_gia_du_doan);
  }

  private toReferenceUnit(item: EstateKccValuationResult, index: number): ReferenceUnit {
    return {
      stt: index + 1,
      floor: item.Tang,
      area: item.Dien_tich,
      bedrooms: item.So_phong_ngu,
      bathrooms: item.So_phong_ve_sinh,
      type: item.Vi_tri,
      priceFrom: item.Min_don_gia_du_doan / 1_000_000,
      priceTo: item.Max_don_gia_du_doan / 1_000_000,
    };
  }

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
