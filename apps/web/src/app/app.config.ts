import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { WebAuthService } from './services/auth.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { WebChargerService } from './services/charger.service';
import { WebHttpInterceptor } from './http-interceptor';
import { WebMapsService } from './services/maps.service';
import { WebUserService } from './services/user.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(), provideRouter(appRoutes), provideAnimationsAsync(),
    provideHttpClient(withInterceptors([WebHttpInterceptor])),
    WebAuthService,
    WebChargerService,
    WebMapsService,
    WebUserService,
    {
      provide: APP_INITIALIZER,
      useFactory: (maps: WebMapsService) => () => maps.loadScript(),
      deps: [WebMapsService],
      multi: true,
    }
  ],
};
