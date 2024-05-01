import { Route } from '@angular/router';
import { isLoggedIn } from './auth.guard';
import { idResolver } from './features/user/id.resolver';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: async () => (await import('./features/home/home.component')).HomeComponent,
    canActivate: [isLoggedIn]
  },
  {
    path: 'user',
    loadComponent: async () => (await import('./features/user/user.component')).UserComponent,
    canActivate: [isLoggedIn],
    resolve: {
      id: idResolver
    }
  },
  {
    path: 'auth',
    loadChildren: async () => (await import('./features/auth/auth.module')).AuthFeatureModule,
  }
];
