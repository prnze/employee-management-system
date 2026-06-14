import {
  APP_INITIALIZER,
  ApplicationConfig,
  ENVIRONMENT_INITIALIZER,
  ErrorHandler,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { RuntimeConfigService } from '@core/services/runtime-config.service';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions
} from '@angular/router';

import {
  provideTranslateService
} from '@ngx-translate/core';

import {
  provideTranslateHttpLoader
} from '@ngx-translate/http-loader';

import { provideAnimations } from '@angular/platform-browser/animations';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';

import { jwtInterceptor } from '@core/interceptors/jwt.interceptor';
import { refreshTokenInterceptor } from '@core/interceptors/refresh-token.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { loadingInterceptor } from '@core/interceptors/loading.interceptor';

import { GlobalErrorHandler } from '@core/error-handling/global-error.handler';
import { SessionService } from '@core/auth/session.service';
import { LanguageService } from '@core/services/language.service';
import { AuthService } from '@core/auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),

    provideZoneChangeDetection({
      eventCoalescing: true
    }),

    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),

    provideHttpClient(
      withInterceptors([
        jwtInterceptor,
        refreshTokenInterceptor,
        errorInterceptor,
        loadingInterceptor
      ])
    ),

    provideCharts(withDefaultRegisterables()),

    // FIXED ngx-translate configuration
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    }),

    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },

    {
      provide: APP_INITIALIZER,
      useFactory: (configService: RuntimeConfigService) => () => configService.loadConfig(),
      deps: [RuntimeConfigService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => authService.restoreSession(),
      deps: [AuthService],
      multi: true
    },

    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => inject(SessionService)
    },

    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => inject(LanguageService)
    }
  ]
};