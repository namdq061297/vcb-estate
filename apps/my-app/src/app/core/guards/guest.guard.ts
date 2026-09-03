import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

export const guestGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  // In SSR, localStorage is unavailable, so skip redirect decisions on the server.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authState = inject(AuthStateService);
  const router = inject(Router);

  return authState.isAuthenticated() ? router.createUrlTree(['/home']) : true;
};
