import { mergeApplicationConfig, ApplicationConfig, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { WA_WINDOW } from '@ng-web-apis/common';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Angular SSR's `document.defaultView` mock is missing browser-only APIs
    // (matchMedia, requestAnimationFrame) that Taiga UI (via @ng-web-apis/common's
    // WA_WINDOW) calls unconditionally. Stub them here so server rendering doesn't crash.
    {
      provide: WA_WINDOW,
      useFactory: () => {
        const win = inject(DOCUMENT).defaultView as Window;

        if (typeof win.matchMedia !== 'function') {
          win.matchMedia = (media: string) =>
            ({
              matches: false,
              media,
              onchange: null,
              addListener: () => {},
              removeListener: () => {},
              addEventListener: () => {},
              removeEventListener: () => {},
              dispatchEvent: () => false,
            }) as MediaQueryList;
        }

        if (typeof win.requestAnimationFrame !== 'function') {
          win.requestAnimationFrame = (callback: FrameRequestCallback) =>
            setTimeout(() => callback(Date.now()), 0) as unknown as number;
          win.cancelAnimationFrame = (handle: number) => clearTimeout(handle);
        }

        return win;
      },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
