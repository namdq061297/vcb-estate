import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { apiInterceptor, authInterceptor } from './core/interceptors/api.interceptor';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeVi from '@angular/common/locales/vi';

registerLocaleData(localeVi);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([apiInterceptor, authInterceptor])),
    { provide: LOCALE_ID, useValue: 'vi-VN' },
  ],
};
