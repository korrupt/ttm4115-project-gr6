import { Route } from '@angular/router';
import { isLoggedIn } from './auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: async () => (await import('./features/home/home.component')).HomeComponent,
    canActivate: [isLoggedIn]
  },
  {
    path: 'auth',
    loadChildren: async () => (await import('./features/auth/auth.module')).AuthFeatureModule,
  }
];
