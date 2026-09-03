import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ButtonComponent } from "../../shared/components/button/button.component";

@Component({
  selector: 'app-shell-layout',
  imports: [RouterOutlet, IconComponent, ButtonComponent],
  templateUrl: './app-shell.layout.html',
  styleUrl: './app-shell.layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellLayout {
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  protected readonly userProfile = this.authState.customerProfile;
  protected readonly isAuthenticated = this.authState.isAuthenticated;
  protected readonly greetingName = computed(() => this.userProfile()?.fullName ?? '');

  protected logout(): void {
    this.authState.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  protected goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  protected goHome(): void {
    this.router.navigateByUrl('/');
  }
}
