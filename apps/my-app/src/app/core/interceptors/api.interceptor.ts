import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const isRelativeUrl = !req.url.startsWith('http');

  if (!isRelativeUrl) {
    return next(req);
  }

  const baseUrl = environment.apiUrl.replace(/\/$/, '');
  const endpoint = req.url.replace(/^\//, '');
  const apiReq = req.clone({ url: `${baseUrl}/${endpoint}` });

  return next(apiReq);
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const token = localStorage.getItem('access_token');

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq);
};
