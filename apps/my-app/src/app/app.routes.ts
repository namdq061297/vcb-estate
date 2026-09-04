import { Routes } from '@angular/router';
import { authChildGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'otp',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/otp/otp.page').then((m) => m.OtpPage),
  },
  {
    path: '',
    canActivateChild: [authChildGuard],
    loadComponent: () =>
      import('./layouts/app-shell/app-shell.layout').then((m) => m.AppShellLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'estate-valuation',
        loadComponent: () =>
          import('./pages/estate-valuation/estate-valuation.component').then(
            (m) => m.EstateValuationComponent,
          ),
      },
      {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
