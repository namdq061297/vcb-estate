import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../shared/components/footer/footer.component';

import { AuthService } from '../../core/services/api/auth.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { TextInputComponent } from '../../shared/components/form/text-input/text-input.component';
import {
  SelectInputComponent,
  SelectInputOption,
} from '../../shared/components/form/select-input/select-input.component';

@Component({
  selector: 'app-home-page',
  imports: [
    TextInputComponent,
    SelectInputComponent,
    CommonModule,
    FooterComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthStateService);

  protected readonly searchValue = signal('');
  protected readonly cityValue = signal<string | undefined>(undefined);
  protected readonly cityOptions: SelectInputOption[] = [
    { label: 'Hà Nội', value: 'hn' },
    { label: 'Hồ Chí Minh', value: 'hcm' },
    { label: 'Đà Nẵng', value: 'dn' },
    { label: 'Cần Thơ', value: 'ct' },
    { label: 'Hải Phòng', value: 'hp' },
  ];
  protected readonly customerProfile = signal<unknown | null>(null);
  protected readonly isLoadingProfile = signal(false);
  protected readonly profileError = signal('');

  ngOnInit(): void {
    this.loadCustomerProfileIfNeeded();
  }

  protected loadCustomerProfileIfNeeded(): void {
    const cachedProfile = this.authState.customerProfile();

    if (cachedProfile) {
      this.customerProfile.set(cachedProfile);
      return;
    }

    this.loadCustomerProfile();
  }

  protected loadCustomerProfile(): void {
    this.isLoadingProfile.set(true);
    this.profileError.set('');

    this.authService.inquiryCustomerProfile().subscribe({
      next: (response) => {
        this.customerProfile.set(response.data);
        this.authState.setCustomerProfile(response.data);
        this.isLoadingProfile.set(false);
      },
      error: () => {
        this.profileError.set('Không gọi được API inquiryCustomerProfile');
        this.isLoadingProfile.set(false);
      },
    });
  }

  protected onSearchChange(value: string): void {
    this.searchValue.set(value);
  }

  protected onCityChange(value: string): void {
    this.cityValue.set(value);
  }
}
