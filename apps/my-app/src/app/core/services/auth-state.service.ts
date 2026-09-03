import { Injectable, PLATFORM_ID, Signal, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CustomerProfile } from '../models/customer-profile.model';

const AUTH_STORAGE_KEY = 'is_authenticated';
const CUSTOMER_PROFILE_STORAGE_KEY = 'customer_profile';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authenticated = signal(false);
  private readonly customerProfileSignal = signal<CustomerProfile | null>(null);

  readonly isAuthenticated: Signal<boolean> = computed(() => this.authenticated());
  readonly customerProfile = computed(() => this.customerProfileSignal());

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedAuthState = localStorage.getItem(AUTH_STORAGE_KEY);
    this.authenticated.set(savedAuthState === 'true');

    const savedCustomerProfile = localStorage.getItem(CUSTOMER_PROFILE_STORAGE_KEY);

    if (savedCustomerProfile) {
      try {
        const parsedProfile = JSON.parse(savedCustomerProfile) as CustomerProfile;
        this.customerProfileSignal.set(parsedProfile);
      } catch {
        localStorage.removeItem(CUSTOMER_PROFILE_STORAGE_KEY);
      }
    }
  }

  login(): void {
    this.authenticated.set(true);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    }
  }

  logout(): void {
    this.authenticated.set(false);
    this.customerProfileSignal.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem('access_token');
      localStorage.removeItem(CUSTOMER_PROFILE_STORAGE_KEY);
    }
  }

  setCustomerProfile(profile: CustomerProfile): void {
    this.customerProfileSignal.set(profile);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(CUSTOMER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    }
  }

  hasCustomerProfile(): boolean {
    return this.customerProfileSignal() !== null;
  }
}
