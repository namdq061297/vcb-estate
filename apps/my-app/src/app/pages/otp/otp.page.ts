import { Location, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ImageComponent } from '../../shared/components/image/image.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NgxOtpInputComponent, type OtpStatus } from 'ngx-otp-input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-otp-page',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    IconComponent,
    ImageComponent,
    NgxOtpInputComponent,
    FooterComponent,
    ReactiveFormsModule,
  ],
})
export class OtpPage {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly phoneNumber = signal('');
  protected readonly otp = signal('');
  private readonly authState = inject(AuthStateService);

  constructor() {
    const phoneFromNavigation = this.router.getCurrentNavigation()?.extras.state?.['phone'] ?? '';
    const phoneFromHistory = isPlatformBrowser(this.platformId) ? (history.state?.phone ?? '') : '';
    const phone = phoneFromNavigation || phoneFromHistory;
    this.phoneNumber.set(phone);
  }

  status: OtpStatus = 'idle';

  form = new FormGroup({
    otp: new FormControl('', { nonNullable: true }),
  });

  verifyOtp(code: string): void {
    console.log('Verifying OTP code:', code);
    if (code?.length === 6) {
      this.otp.set(code);
    }
    // Verify the code, then set status to 'success' or 'error'
  }

  protected goBack(): void {
    this.location.back();
  }

  protected onConfirm(): void {
    console.log('OTP confirmed:');
    this.authState.login();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
