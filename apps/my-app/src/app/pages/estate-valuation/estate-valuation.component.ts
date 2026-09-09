import {
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxOtpInputComponent, type OtpStatus } from 'ngx-otp-input';
import {
  SelectInputComponent,
  SelectInputOption,
} from '../../shared/components/form/select-input/select-input.component';
import { TextInputComponent } from '../../shared/components/form/text-input/text-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AppModalizeComponent } from '../../shared/components/modalize/modalize.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

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
    NgxOtpInputComponent,
    FooterComponent
  ],
  templateUrl: 'estate-valuation.component.html',
  styleUrls: ['estate-valuation.component.scss'],
})
export class EstateValuationComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);

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

  apartmentSubmitted = false;
  landSubmitted = false;

  onTabChange(tab: EstateTab): void {
    this.activeTab = tab;
  }

  onSubmit(): void {
    this.showPurposeModal = true;
    return
    const form = this.activeTab === 'apartment' ? this.apartmentForm : this.landForm;
    form.markAllAsTouched();

    if (this.activeTab === 'apartment') {
      this.apartmentSubmitted = true;
    } else {
      this.landSubmitted = true;
    }

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
    this.openOtpModal();
  }

  closeQuotaModal(): void {
    this.showQuotaModal = false;
  }

  readonly demoPhoneNumber = '0345765432';
  readonly otpResendDuration = 90;

  showOtpModal = false;
  otpStatus: OtpStatus = 'idle';
  otpValue = '';
  readonly resendSeconds = signal(0);
  otpForm = new FormGroup({
    otp: new FormControl('', { nonNullable: true }),
  });

  private resendTimerId: ReturnType<typeof setInterval> | null = null;

  get maskedPhoneNumber(): string {
    const raw =
      (this.apartmentForm.get('phoneNumber')?.value as string | null) || this.demoPhoneNumber;

    return raw.length > 4 ? raw.slice(0, 4) + '*'.repeat(raw.length - 4) : raw;
  }

  readonly resendLabel = computed(() => {
    const minutes = Math.floor(this.resendSeconds() / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.resendSeconds() % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  readonly canResendOtp = computed(() => this.resendSeconds() <= 0);

  openOtpModal(): void {
    this.otpForm.get('otp')?.reset('');
    this.otpValue = '';
    this.otpStatus = 'idle';
    this.showOtpModal = true;
    this.startResendCountdown();
    this.focusOtpInput();
  }

  closeOtpModal(): void {
    this.showOtpModal = false;
    this.stopResendCountdown();
  }

  onOtpComplete(code: string): void {
    this.otpValue = code;
    this.otpStatus = 'idle';
  }

  resendOtp(): void {
    if (!this.canResendOtp()) {
      return;
    }

    this.otpForm.get('otp')?.reset('');
    this.otpValue = '';
    this.otpStatus = 'idle';
    this.startResendCountdown();
  }

  onConfirmOtp(): void {
    if (this.otpValue.length !== 6) {
      return;
    }

    this.showOtpModal = false;
    this.stopResendCountdown();
    this.showQuotaModal = true;
  }

  private startResendCountdown(): void {
    this.stopResendCountdown();
    this.resendSeconds.set(this.otpResendDuration);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.resendTimerId = setInterval(() => {
      this.resendSeconds.update((seconds) => Math.max(seconds - 1, 0));
      if (this.resendSeconds() === 0) {
        this.stopResendCountdown();
      }
    }, 1000);
  }

  private stopResendCountdown(): void {
    if (this.resendTimerId !== null) {
      clearInterval(this.resendTimerId);
      this.resendTimerId = null;
    }
  }

  private focusOtpInput(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    setTimeout(() => {
      const input = (this.elementRef.nativeElement as HTMLElement).querySelector(
        '.otp-modal__input input.ngx-otp-input-native',
      );
      (input as HTMLInputElement | null)?.focus();
    });
  }

  ngOnDestroy(): void {
    this.stopResendCountdown();
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
