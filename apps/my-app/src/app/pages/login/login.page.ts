import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ImageComponent } from '../../shared/components/image/image.component';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { PHONE_PATTERN_SOURCE } from '../../shared/validation/phone.validation';
import { LOGIN_VALIDATION_MESSAGES } from '../../shared/validation/validation-messages';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, IconComponent, ImageComponent, TextInputComponent, FooterComponent],
})
export class LoginPage {
  private readonly authState = inject(AuthStateService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  protected readonly phonePattern = PHONE_PATTERN_SOURCE;
  protected readonly validationMessages = LOGIN_VALIDATION_MESSAGES;
  protected readonly submitAttempted = signal(false);
  protected readonly documentId = signal('');
  protected readonly phoneNumber = signal('');

  readonly canLogin = computed(() => {
    const documentId = this.documentId().trim();
    const phoneNumber = this.phoneNumber().trim();

    return documentId.length > 0 && phoneNumber.length > 0;
  });

  protected goBack(): void {
    this.location.back();
  }

  protected onLogin(): void {
    this.submitAttempted.set(true);

    if (!this.canLogin()) {
      return;
    }

    console.log('Document ID:', this.documentId());
    console.log('Phone Number:', this.phoneNumber());
    // this.router.navigate(['/otp'], {
    //   queryParams: {
    //     phone: this.phoneNumber().trim(),
    //   },
    // });
    this.router.navigate(['/otp'], {
      state: { phone: this.phoneNumber().trim() },
    });
    // this.authState.login();
  }

  protected onDocumentIdChange(value: string): void {
    this.documentId.set(value);
  }

  protected onPhoneNumberChange(value: string): void {
    this.phoneNumber.set(value);
  }
}
