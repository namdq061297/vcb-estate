import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SelectInputComponent,
  SelectInputOption,
} from '../../shared/components/form/select-input/select-input.component';
import { TextInputComponent } from '../../shared/components/form/text-input/text-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AppModalizeComponent } from '../../shared/components/modalize/modalize.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

type EstateTab = 'apartment' | 'land';

interface PurposeOption {
  value: string;
  label: string;
}

@Component({
  selector: 'vcb-estate-valuation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectInputComponent,
    TextInputComponent,
    ButtonComponent,
    AppModalizeComponent,
    IconComponent,
  ],
  templateUrl: 'estate-valuation.component.html',
  styleUrls: ['estate-valuation.component.scss'],
})
export class EstateValuationComponent {
  private readonly fb = inject(FormBuilder);

  activeTab: EstateTab = 'apartment';

  provinces: SelectInputOption[] = [];
  wards: SelectInputOption[] = [];
  urbanAreas: SelectInputOption[] = [];
  buildings: SelectInputOption[] = [];

  apartmentForm: FormGroup = this.fb.group({
    provinceId: [null, Validators.required],
    wardId: [null, Validators.required],
    urbanAreaId: [null, Validators.required],
    buildingId: [null, Validators.required],
    apartmentNumber: [null, Validators.required],
    phoneNumber: [null, Validators.required],
  });

  landForm: FormGroup = this.fb.group({
    provinceId: [null, Validators.required],
    wardId: [null, Validators.required],
    urbanAreaId: [null, Validators.required],
    landLotNumber: [null, Validators.required],
  });

  showPurposeModal = false;

  purposeOptions: PurposeOption[] = [
    { value: 'mortgage', label: 'Thế chấp vay vốn' },
    { value: 'buy', label: 'Mua bất động sản' },
    { value: 'sell', label: 'Bán bất động sản' },
    { value: 'other', label: 'Khác' },
  ];

  purposeControl = new FormControl<string | null>('sell');

  showQuotaModal = false;

  readonly nextAvailableDate = '20/06/2026';
  readonly supportHotline = '1900 545413';

  onTabChange(tab: EstateTab): void {
    this.activeTab = tab;
  }

  onSubmit(): void {
    this.showPurposeModal = true;
    return;

    const form = this.activeTab === 'apartment' ? this.apartmentForm : this.landForm;
    form.markAllAsTouched();

    if (form.invalid) {
      return;
    }

    this.showPurposeModal = true;
  }

  closePurposeModal(): void {
    this.showPurposeModal = false;
  }

  onContinuePurpose(): void {
    if (!this.purposeControl.value) {
      return;
    }

    this.showPurposeModal = false;
    this.showQuotaModal = true;
  }

  closeQuotaModal(): void {
    this.showQuotaModal = false;
  }

  showDownloadAppModal = false;

  openDownloadAppModal(): void {
    this.showQuotaModal = false;
    this.showDownloadAppModal = true;
  }

  closeDownloadAppModal(): void {
    this.showDownloadAppModal = false;
  }
}
